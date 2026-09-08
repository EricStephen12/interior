import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_for_build');
const DEFAULT_FROM = process.env.EMAIL_FROM || 'SHARERS GYM <support@sharersgym.com>';
const ADMIN_EMAIL = 'sharersmall@gmail.com';

export function generateQuickApproveToken(orderId: string): string {
  const secret = process.env.CLERK_SECRET_KEY || process.env.RESEND_API_KEY || 'sharers_secret_token_key';
  return crypto.createHmac('sha256', secret).update(`approve_${orderId}`).digest('hex');
}

export function verifyQuickApproveToken(orderId: string, token: string): boolean {
  if (!orderId || !token) return false;
  try {
    const expected = generateQuickApproveToken(orderId);
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}

export interface OrderEmailItem {
  name: string;
  quantity: number;
  price: number;
  variant?: string;
  size?: string;
}

export interface BankTransferDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export const emailService = {
  /**
   * Generic sender with Resend
   */
  async sendEmail({
    to,
    subject,
    html,
    attachments,
  }: {
    to: string | string[];
    subject: string;
    html: string;
    attachments?: Array<{ filename: string; content: string | Buffer; path?: string }>;
  }) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('[Resend] RESEND_API_KEY missing. Email not sent.');
      return null;
    }

    try {
      const recipients = Array.isArray(to) ? to : [to];
      const data = await resend.emails.send({
        from: DEFAULT_FROM,
        to: recipients,
        subject,
        html,
        attachments: attachments as any,
      });
      console.log(`[Resend] Email sent to ${recipients.join(', ')}:`, data?.data?.id || 'OK');
      return data;
    } catch (error) {
      console.error('[Resend] Error sending email:', error);
      return null;
    }
  },

  /**
   * Trigger Resend Custom Events for Resend Automations
   * Automations can be configured in the Resend Dashboard to trigger on:
   * - order.created
   * - order.paid
   * - order.shipped
   * - order.delivered
   * - member.pass_purchased
   * - member.pass_delivered
   * - credits.low
   */
  async triggerResendEvent({
    name,
    email,
    data = {},
  }: {
    name: string;
    email: string;
    data?: Record<string, any>;
  }) {
    if (!process.env.RESEND_API_KEY) return null;

    try {
      // Resend Automations Event endpoint
      const response = await fetch('https://api.resend.com/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          data,
        }),
      });

      if (!response.ok) {
        // Events API may require specific dashboard tier or configuration, gracefully log
        console.warn(`[Resend Automation] Event '${name}' response status: ${response.status}`);
        return null;
      }

      const resJson = await response.json();
      console.log(`[Resend Automation] Triggered event '${name}' for ${email}`);
      return resJson;
    } catch (err) {
      console.warn(`[Resend Automation] Failed to trigger event '${name}':`, err);
      return null;
    }
  },

  /**
   * 1. Customer: Order Confirmation & Receipt (KingsPay / Paid Transfer)
   */
  async sendOrderConfirmationEmail({
    orderId,
    userEmail,
    userName = 'Valued Member',
    items = [],
    totalAmount,
    shippingAddress,
    paymentMethod = 'KingsPay Online',
  }: {
    orderId: string;
    userEmail: string;
    userName?: string;
    items: OrderEmailItem[];
    totalAmount: number;
    shippingAddress?: string;
    paymentMethod?: string;
  }) {
    const formattedTotal = `₦${Number(totalAmount).toLocaleString()}`;
    const itemsHtml = items.map((item) => `
      <tr style="border-bottom: 1px solid #22252e;">
        <td style="padding: 14px 0; color: #ffffff; font-size: 13px; font-weight: 600;">
          ${item.name}
          ${item.variant || item.size ? `<span style="display: block; font-size: 11px; color: #8a93a5; text-transform: uppercase;">${item.variant || item.size}</span>` : ''}
        </td>
        <td style="padding: 14px 0; color: #8a93a5; font-size: 13px; text-align: center;">x${item.quantity || 1}</td>
        <td style="padding: 14px 0; color: #ffffff; font-size: 13px; font-weight: 700; text-align: right;">₦${Number(item.price * (item.quantity || 1)).toLocaleString()}</td>
      </tr>
    `).join('');

    const html = `
      <div style="background-color: #0b0c10; font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; border: 1px solid #1f232e;">
        <div style="padding: 32px 32px 24px; border-bottom: 1px solid #1f232e; text-align: center;">
          <div style="display: inline-block; padding: 4px 12px; background: rgba(242, 13, 13, 0.12); border: 1px solid rgba(242, 13, 13, 0.3); color: #f20d0d; font-size: 9px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px;">
            ORDER CONFIRMED
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #ffffff;">SHARERS GYM</h1>
          <p style="margin: 8px 0 0; color: #8a93a5; font-size: 13px;">Order #${orderId.slice(-8).toUpperCase()}</p>
        </div>

        <div style="padding: 32px;">
          <p style="font-size: 15px; line-height: 1.6; color: #e1e4ea; margin-top: 0;">
            Hello <strong>${userName}</strong>,
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #a1a9b8;">
            Thank you for your order. We have received your payment via <strong>${paymentMethod}</strong> and our team is preparing your items for delivery.
          </p>

          <div style="margin: 28px 0; background: #12141a; border: 1px solid #1f232e; padding: 20px 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 1px solid #2a2f3d; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; color: #8a93a5;">
                  <th style="padding-bottom: 10px; text-align: left;">Item</th>
                  <th style="padding-bottom: 10px; text-align: center;">Qty</th>
                  <th style="padding-bottom: 10px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding-top: 18px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #ffffff;">Total Paid</td>
                  <td style="padding-top: 18px; font-size: 16px; font-weight: 900; color: #ffffff; text-align: right;">${formattedTotal}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          ${shippingAddress ? `
            <div style="margin-bottom: 28px; padding: 16px 20px; background: #12141a; border-left: 3px solid #f20d0d;">
              <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #8a93a5; margin-bottom: 4px;">Delivery Destination</span>
              <p style="margin: 0; font-size: 13px; color: #ffffff; line-height: 1.5;">${shippingAddress}</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin: 36px 0 16px;">
            <a href="https://sharersgym.com/dashboard" style="display: inline-block; background: #ffffff; color: #0b0c10; padding: 14px 28px; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; margin-right: 8px; margin-bottom: 8px;">
              VIEW IN DASHBOARD
            </a>
            <a href="https://sharersgym.com/receipt/${orderId}" style="display: inline-block; background: #f20d0d; color: #ffffff; padding: 14px 28px; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; margin-bottom: 8px;">
              DOWNLOAD RECEIPT (PDF)
            </a>
          </div>
        </div>

        <div style="padding: 24px 32px; background: #08090c; border-top: 1px solid #1f232e; text-align: center; font-size: 11px; color: #626a7a;">
          <p style="margin: 0 0 6px;">SHARERS GYM • Lagos, Nigeria • support@sharersgym.com</p>
          <p style="margin: 0;">Have questions? Reply directly to this email for member concierge.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Order Confirmed: #${orderId.slice(-8).toUpperCase()} • SHARERS GYM`,
      html,
    });
  },

  /**
   * 2. Customer: Bank Transfer Instructions & Payment Reference
   */
  async sendBankTransferInstructionsEmail({
    orderId,
    userEmail,
    userName = 'Valued Member',
    totalAmount,
    bankDetails,
    transferReference,
  }: {
    orderId: string;
    userEmail: string;
    userName?: string;
    totalAmount: number;
    bankDetails: BankTransferDetails;
    transferReference?: string;
  }) {
    const formattedTotal = `₦${Number(totalAmount).toLocaleString()}`;
    const ref = transferReference || orderId.slice(-8).toUpperCase();

    const html = `
      <div style="background-color: #0b0c10; font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; border: 1px solid #1f232e;">
        <div style="padding: 32px 32px 24px; border-bottom: 1px solid #1f232e; text-align: center;">
          <div style="display: inline-block; padding: 4px 12px; background: rgba(242, 13, 13, 0.15); border: 1px solid rgba(242, 13, 13, 0.35); color: #f20d0d; font-size: 9px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px;">
            ACTION REQUIRED • BANK TRANSFER
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #ffffff;">SHARERS GYM</h1>
          <p style="margin: 8px 0 0; color: #8a93a5; font-size: 13px;">Order #${orderId.slice(-8).toUpperCase()}</p>
        </div>

        <div style="padding: 32px;">
          <p style="font-size: 15px; line-height: 1.6; color: #e1e4ea; margin-top: 0;">
            Hello <strong>${userName}</strong>,
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #a1a9b8;">
            Your order has been reserved. Please complete your bank transfer using the account details below to activate your order / gym access pass.
          </p>

          <div style="margin: 28px 0; background: #12141a; border: 1px solid #1f232e; padding: 24px;">
            <div style="margin-bottom: 16px;">
              <span style="font-size: 10px; color: #8a93a5; text-transform: uppercase; letter-spacing: 2px;">Bank Name</span>
              <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #ffffff;">${bankDetails.bankName}</p>
            </div>
            <div style="margin-bottom: 16px;">
              <span style="font-size: 10px; color: #8a93a5; text-transform: uppercase; letter-spacing: 2px;">Account Number</span>
              <p style="margin: 4px 0 0; font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: 2px; font-family: monospace;">${bankDetails.accountNumber}</p>
            </div>
            <div style="margin-bottom: 16px;">
              <span style="font-size: 10px; color: #8a93a5; text-transform: uppercase; letter-spacing: 2px;">Account Name</span>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #ffffff;">${bankDetails.accountName}</p>
            </div>
            <div style="margin-bottom: 16px; padding-top: 16px; border-top: 1px solid #22252e;">
              <span style="font-size: 10px; color: #8a93a5; text-transform: uppercase; letter-spacing: 2px;">Exact Transfer Amount</span>
              <p style="margin: 4px 0 0; font-size: 22px; font-weight: 900; color: #ffffff;">${formattedTotal}</p>
            </div>
            <div style="padding: 12px; background: rgba(242, 13, 13, 0.08); border: 1px dashed rgba(242, 13, 13, 0.3);">
              <span style="font-size: 9px; color: #f20d0d; text-transform: uppercase; letter-spacing: 2px; font-weight: 800;">Transfer Description / Narration</span>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 900; color: #ffffff; font-family: monospace;">${ref}</p>
            </div>
          </div>

          <p style="font-size: 13px; color: #8a93a5; line-height: 1.6;">
            Once you make the transfer, our accounts team will verify the payment and your order will automatically update to <strong>PAID</strong>.
          </p>
        </div>

        <div style="padding: 24px 32px; background: #08090c; border-top: 1px solid #1f232e; text-align: center; font-size: 11px; color: #626a7a;">
          <p style="margin: 0;">Need immediate verification? Reply to this email with your transfer receipt.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Payment Instructions for Order #${orderId.slice(-8).toUpperCase()} • SHARERS GYM`,
      html,
    });
  },

  /**
   * 3. Admin: New Order & Payment Verification Alert
   */
  async sendAdminNewOrderAlert({
    orderId,
    userEmail,
    userName,
    totalAmount,
    paymentType,
    items = [],
    shippingDetails,
    status,
  }: {
    orderId: string;
    userEmail: string;
    userName?: string;
    totalAmount: number;
    paymentType: string;
    items?: any[];
    shippingDetails?: any;
    status: string;
  }) {
    const formattedTotal = `₦${Number(totalAmount).toLocaleString()}`;
    const isManual = paymentType === 'MANUAL_BANK_TRANSFER';

    const html = `
      <div style="font-family: Arial, sans-serif; background: #0b0c10; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #222;">
        <h2 style="color: #f20d0d; margin-top: 0;">⚡ [ADMIN ALERT] New Order Received</h2>
        <p>A new order has been initiated on Sharers Gym storefront.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #14171f; padding: 16px;">
          <tr><td style="padding: 8px; color: #888;">Order ID:</td><td style="padding: 8px; font-weight: bold; color: #fff;">#${orderId}</td></tr>
          <tr><td style="padding: 8px; color: #888;">Customer:</td><td style="padding: 8px; color: #fff;">${userName || 'Customer'} (${userEmail})</td></tr>
          <tr><td style="padding: 8px; color: #888;">Total:</td><td style="padding: 8px; font-size: 18px; color: #ffffff; font-weight: bold;">${formattedTotal}</td></tr>
          <tr><td style="padding: 8px; color: #888;">Method:</td><td style="padding: 8px; color: #fff;">${paymentType}</td></tr>
          <tr><td style="padding: 8px; color: #888;">Current Status:</td><td style="padding: 8px; color: ${status === 'PAID' ? '#4ade80' : '#f59e0b'}; font-weight: bold;">${status}</td></tr>
          ${shippingDetails?.phone ? `<tr><td style="padding: 8px; color: #888;">Phone:</td><td style="padding: 8px; color: #fff;">${shippingDetails.phone}</td></tr>` : ''}
          ${shippingDetails?.address ? `<tr><td style="padding: 8px; color: #888;">Address:</td><td style="padding: 8px; color: #fff;">${shippingDetails.address}</td></tr>` : ''}
        </table>

        ${isManual ? `
          <div style="padding: 16px; background: rgba(245, 158, 11, 0.12); border: 1px solid #f59e0b; margin-bottom: 24px; border-radius: 4px;">
            <strong style="color: #f59e0b; display: block; font-size: 13px; margin-bottom: 8px;">⚠️ Action Required: Bank Transfer Verification</strong>
            <p style="margin: 0 0 16px; font-size: 12px; color: #ccc; line-height: 1.5;">
              Confirm the credit alert in your bank app. You can verify and credit this member directly with 1 tap:
            </p>
            <a href="https://www.sharersgym.com/api/admin/orders/quick-approve?orderId=${orderId}&token=${generateQuickApproveToken(orderId)}" style="display: inline-block; background: #22c55e; color: #ffffff; padding: 12px 24px; font-weight: 900; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; border-radius: 4px; margin-right: 12px;">
              ⚡ 1-Click Approve & Credit Member
            </a>
            <a href="https://sharersgym.com/admin/orders" style="display: inline-block; background: transparent; color: #8a93a5; padding: 12px 16px; font-weight: 700; font-size: 11px; text-decoration: underline; text-transform: uppercase;">
              Open Admin Orders
            </a>
          </div>
        ` : `
          <div style="margin-top: 24px;">
            <a href="https://sharersgym.com/admin/orders" style="display: inline-block; background: #f20d0d; color: #ffffff; padding: 12px 24px; font-weight: bold; text-decoration: none; text-transform: uppercase; font-size: 12px;">
              Open Admin Orders
            </a>
          </div>
        `}
      </div>
    `;

    return this.sendEmail({
      to: ADMIN_EMAIL,
      subject: `[New Order] ${formattedTotal} - ${userEmail} (${status})`,
      html,
    });
  },

  /**
   * 4. Customer: Order Status Updated (Shipped, Delivered, Cancelled)
   */
  async sendOrderStatusUpdateEmail({
    orderId,
    userEmail,
    userName = 'Valued Member',
    newStatus,
    trackingNote,
    items,
  }: {
    orderId: string;
    userEmail: string;
    userName?: string;
    newStatus: string;
    trackingNote?: string;
    items?: any;
  }) {
    // Safely parse items
    let parsedItems: Array<{ name: string; quantity?: number; price?: number; variant?: string; size?: string }> = [];
    if (Array.isArray(items)) {
      parsedItems = items;
    } else if (typeof items === 'string') {
      try {
        const parsed = JSON.parse(items);
        parsedItems = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        parsedItems = [];
      }
    }

    // Build specific product description summary
    let itemsSummary = '';
    if (parsedItems.length === 1) {
      const it = parsedItems[0];
      const variantText = it.variant || it.size ? ` (${it.variant || it.size})` : '';
      const qtyText = it.quantity && it.quantity > 1 ? `${it.quantity}x ` : '';
      itemsSummary = `${qtyText}${it.name}${variantText}`;
    } else if (parsedItems.length > 1) {
      const names = parsedItems.map(i => {
        const variantText = i.variant || i.size ? ` (${i.variant || i.size})` : '';
        const qtyText = i.quantity && i.quantity > 1 ? `${i.quantity}x ` : '';
        return `${qtyText}${i.name}${variantText}`;
      });
      if (names.length === 2) {
        itemsSummary = `${names[0]} and ${names[1]}`;
      } else {
        itemsSummary = `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
      }
    }

    // Build package items HTML table rows
    const packageItemsRows = parsedItems.length > 0 ? parsedItems.map(item => `
      <tr style="border-bottom: 1px solid #1f2430;">
        <td style="padding: 12px 0; color: #ffffff; font-size: 13px; font-weight: 600;">
          ${item.name}
          ${item.variant || item.size ? `<span style="display: block; font-size: 11px; color: #8a93a5; text-transform: uppercase;">${item.variant || item.size}</span>` : ''}
        </td>
        <td style="padding: 12px 0; color: #8a93a5; font-size: 13px; text-align: center;">x${item.quantity || 1}</td>
        <td style="padding: 12px 0; color: #ffffff; font-size: 13px; font-weight: 700; text-align: right;">
          ${item.price ? `₦${Number(item.price * (item.quantity || 1)).toLocaleString()}` : ''}
        </td>
      </tr>
    `).join('') : '';

    const statusLabels: Record<string, { title: string; desc: string; color: string; bg: string; border: string }> = {
      SHIPPED: {
        title: 'YOUR ORDER HAS BEEN DISPATCHED',
        desc: itemsSummary
          ? `Our logistics team has dispatched your package containing <strong>${itemsSummary}</strong>. It is currently en route to your delivery location.`
          : 'Our logistics team has dispatched your order. It is currently en route to your delivery location.',
        color: '#38bdf8',
        bg: 'rgba(56, 189, 248, 0.12)',
        border: 'rgba(56, 189, 248, 0.3)',
      },
      DELIVERED: {
        title: 'ORDER DELIVERED SUCCESSFULLY',
        desc: itemsSummary
          ? `Your package containing <strong>${itemsSummary}</strong> has been successfully delivered! We hope you enjoy your items. Train hard and see you at the gym.`
          : 'Your package has been delivered! We hope you enjoy your new items. Train hard and see you at the gym.',
        color: '#4ade80',
        bg: 'rgba(74, 222, 128, 0.12)',
        border: 'rgba(74, 222, 128, 0.3)',
      },
      CANCELLED: {
        title: 'ORDER CANCELLED',
        desc: itemsSummary
          ? `Your order for <strong>${itemsSummary}</strong> has been cancelled. If a refund is due or if this was in error, please contact member support.`
          : 'Your order has been cancelled. If a refund is due or if this was in error, please contact member support.',
        color: '#f87171',
        bg: 'rgba(248, 113, 113, 0.12)',
        border: 'rgba(248, 113, 113, 0.3)',
      },
    };

    const statusInfo = statusLabels[newStatus] || {
      title: `ORDER STATUS: ${newStatus}`,
      desc: itemsSummary
        ? `Your order for <strong>${itemsSummary}</strong> has been updated to ${newStatus}.`
        : `Your order status has been updated to ${newStatus}.`,
      color: '#f20d0d',
      bg: 'rgba(242, 13, 13, 0.12)',
      border: 'rgba(242, 13, 13, 0.3)',
    };

    const html = `
      <div style="background-color: #0b0c10; font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; border: 1px solid #1f232e;">
        <div style="padding: 32px; border-bottom: 1px solid #1f232e; text-align: center;">
          <div style="display: inline-block; padding: 4px 12px; background: ${statusInfo.bg}; border: 1px solid ${statusInfo.border}; color: ${statusInfo.color}; font-size: 10px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px;">
            ${statusInfo.title}
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff;">SHARERS GYM</h1>
          <p style="margin: 8px 0 0; color: #8a93a5; font-size: 13px;">Order #${orderId.slice(-8).toUpperCase()}</p>
        </div>

        <div style="padding: 32px;">
          <p style="font-size: 15px; color: #ffffff; margin-top: 0;">Hello <strong>${userName}</strong>,</p>
          <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">${statusInfo.desc}</p>

          ${packageItemsRows ? `
            <div style="margin: 24px 0; background: #12141a; border: 1px solid #1f232e; padding: 18px 20px;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #8a93a5; display: block; margin-bottom: 10px; font-weight: 800;">Package Contents</span>
              <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                  ${packageItemsRows}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${trackingNote ? `
            <div style="margin: 24px 0; padding: 16px; background: #12141a; border-left: 3px solid ${statusInfo.color};">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #8a93a5;">Courier / Tracking Details</span>
              <p style="margin: 4px 0 0; font-size: 13px; color: #ffffff;">${trackingNote}</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 32px;">
            <a href="https://sharersgym.com/dashboard" style="display: inline-block; background: #ffffff; color: #000; padding: 12px 24px; font-weight: 900; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; margin-right: 8px; margin-bottom: 8px;">
              VIEW MY ORDERS
            </a>
            <a href="https://sharersgym.com/receipt/${orderId}" style="display: inline-block; background: #f20d0d; color: #ffffff; padding: 12px 24px; font-weight: 900; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; margin-bottom: 8px;">
              OFFICIAL RECEIPT
            </a>
          </div>
        </div>

        <div style="padding: 24px 32px; background: #08090c; border-top: 1px solid #1f232e; text-align: center; font-size: 11px; color: #626a7a;">
          <p style="margin: 0 0 6px;">SHARERS GYM • Lagos, Nigeria • support@sharersgym.com</p>
          <p style="margin: 0;">Have questions? Reply directly to this email for member concierge.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Update on Order #${orderId.slice(-8).toUpperCase()} • SHARERS GYM`,
      html,
    });
  },

  /**
   * 5. Customer: Digital Member Pass Delivery with QR Code
   */
  async sendMemberPassEmail({
    userEmail,
    userName = 'Valued Member',
    memberId,
    planName,
    credits,
    tier = 'BLACK',
    qrCodeDataUrl,
  }: {
    userEmail: string;
    userName?: string;
    memberId: string;
    planName: string;
    credits: number;
    tier?: string;
    qrCodeDataUrl?: string;
  }) {
    const html = `
      <div style="background-color: #0b0c10; font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 580px; margin: 0 auto; color: #ffffff; border: 1px solid #1f232e; overflow: hidden;">
        <!-- Header -->
        <div style="padding: 32px 24px 20px; background: radial-gradient(circle at top right, #1f2430 0%, #0b0c10 70%); text-align: center; border-bottom: 1px solid #1f232e;">
          <div style="display: inline-block; padding: 4px 12px; background: rgba(242, 13, 13, 0.15); border: 1px solid rgba(242, 13, 13, 0.35); color: #f20d0d; font-size: 9px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 10px;">
            OFFICIAL ACCESS CREDENTIAL
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #ffffff;">SHARERS GYM</h1>
        </div>

        <div style="padding: 28px 24px;">
          <p style="font-size: 15px; color: #ffffff; margin-top: 0; text-align: center;">
            Member: <strong>${userName}</strong>
          </p>

          <!-- Pass Card Graphic Container -->
          <div style="margin: 20px auto; max-width: 380px; background: #12141c; border: 1px solid #2a2f3d; padding: 24px; text-align: center; border-radius: 4px;">
            <div style="font-size: 10px; font-weight: 800; letter-spacing: 2px; color: #f20d0d; text-transform: uppercase; margin-bottom: 6px;">
              ${planName}
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #8a93a5; font-family: monospace; letter-spacing: 2px; margin-bottom: 20px;">
              ID: ${memberId}
            </div>

            <!-- QR Code Embed -->
            ${qrCodeDataUrl ? `
              <div style="display: inline-block; padding: 14px; background: #ffffff; margin-bottom: 18px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                <img src="${qrCodeDataUrl}" alt="Sharers Gym Access QR" width="160" height="160" style="display: block; width: 160px; height: 160px;" />
              </div>
            ` : `
              <div style="padding: 24px; background: #1f2430; margin-bottom: 18px; border: 1px dashed #f20d0d;">
                <p style="margin: 0; font-family: monospace; font-size: 14px; color: #f20d0d;">SHARERS_PASS_${memberId}</p>
              </div>
            `}

            <div style="border-top: 1px solid #222735; padding-top: 16px; display: flex; justify-content: space-between; text-align: left;">
              <div>
                <span style="font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #8a93a5; display: block;">Credits Remaining</span>
                <span style="font-size: 18px; font-weight: 900; color: #ffffff;">${credits} SESSIONS</span>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #8a93a5; display: block;">Tier</span>
                <span style="font-size: 14px; font-weight: 800; color: #f20d0d; text-transform: uppercase;">${tier}</span>
              </div>
            </div>
          </div>

          <div style="margin-top: 24px; padding: 16px; background: #12141c; border-left: 3px solid #f20d0d; font-size: 12px; color: #9fa8b8; line-height: 1.6;">
            <strong style="color: #ffffff;">At Reception:</strong> Show this QR code directly from your phone screen to the reception scanner for automated entry check-in.
          </div>

          <div style="text-align: center; margin-top: 28px;">
            <a href="https://sharersgym.com/dashboard" style="display: inline-block; background: #f20d0d; color: #ffffff; padding: 12px 32px; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; text-decoration: none;">
              OPEN DIGITAL PASS
            </a>
          </div>
        </div>

        <div style="padding: 20px 24px; background: #08090c; border-top: 1px solid #1f232e; text-align: center; font-size: 11px; color: #626a7a;">
          <p style="margin: 0;">Sharers Gym • Pass valid across all gym facilities.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Your Sharers Gym Pass & QR Access Code (${memberId})`,
      html,
    });
  },

  /**
   * 6. Admin: Low Stock / Restock Alert
   */
  async sendLowStockAlert({
    productName,
    remainingStock,
    productId,
  }: {
    productName: string;
    remainingStock: number;
    productId: string;
  }) {
    const isOutOfStock = remainingStock <= 0;
    const badgeColor = isOutOfStock ? '#ef4444' : '#f59e0b';
    const statusText = isOutOfStock ? 'OUT OF STOCK (0 UNITS)' : `LOW STOCK: ${remainingStock} UNITS REMAINING`;

    const html = `
      <div style="background-color: #0b0c10; font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 580px; margin: 0 auto; color: #ffffff; border: 1px solid #1f232e;">
        <div style="padding: 28px 24px; border-bottom: 1px solid #1f232e; text-align: center;">
          <div style="display: inline-block; padding: 4px 12px; background: rgba(239, 68, 68, 0.15); border: 1px solid ${badgeColor}; color: ${badgeColor}; font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;">
            ${statusText}
          </div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff;">SHARERS GYM INVENTORY</h1>
        </div>
        <div style="padding: 28px 24px;">
          <p style="font-size: 14px; color: #e1e4ea; margin-top: 0;">
            Attention Admin: Stock for <strong>${productName}</strong> has reached the warning threshold.
          </p>
          <div style="margin: 20px 0; background: #12141c; border: 1px solid #2a2f3d; padding: 20px;">
            <p style="margin: 0 0 8px; font-size: 12px; color: #8a93a5;">Product: <span style="color: #ffffff; font-weight: 700;">${productName}</span></p>
            <p style="margin: 0; font-size: 12px; color: #8a93a5;">Units Remaining: <span style="color: ${badgeColor}; font-weight: 900; font-size: 16px;">${remainingStock}</span></p>
          </div>
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://sharersgym.com/admin/products" style="display: inline-block; background: #f20d0d; color: #ffffff; padding: 12px 28px; font-weight: 900; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none;">
              MANAGE INVENTORY
            </a>
          </div>
        </div>
        <div style="padding: 16px 24px; background: #08090c; border-top: 1px solid #1f232e; text-align: center; font-size: 11px; color: #626a7a;">
          <p style="margin: 0;">Sharers Gym • Automated Inventory Telemetry</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: ADMIN_EMAIL,
      subject: `⚠️ [Stock Alert] ${productName}: ${remainingStock} unit(s) remaining`,
      html,
    });
  },

  /**
   * Admin: Simultaneous Inventory Purchase Collision Alert
   */
  async sendInventoryCollisionAlert({
    orderId,
    productName,
    customerName,
    customerEmail,
  }: {
    orderId: string;
    productName: string;
    customerName: string;
    customerEmail: string;
  }) {
    const html = `
      <div style="background-color: #0b0c10; font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 580px; margin: 0 auto; color: #ffffff; border: 1px solid #1f232e;">
        <div style="padding: 28px 24px; border-bottom: 1px solid #1f232e; text-align: center;">
          <div style="display: inline-block; padding: 4px 12px; background: rgba(242, 13, 13, 0.2); border: 1px solid #f20d0d; color: #f20d0d; font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;">
            SIMULTANEOUS PURCHASE COLLISION
          </div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff;">INVENTORY GUARD ALERT</h1>
        </div>
        <div style="padding: 28px 24px;">
          <p style="font-size: 14px; color: #e1e4ea; margin-top: 0;">
            A purchase collision occurred on Order <strong>#${orderId.slice(-8).toUpperCase()}</strong>.
          </p>
          <div style="margin: 20px 0; background: #12141c; border: 1px solid #2a2f3d; padding: 20px;">
            <p style="margin: 0 0 8px; font-size: 12px; color: #8a93a5;">Product: <span style="color: #ffffff; font-weight: 700;">${productName}</span></p>
            <p style="margin: 0 0 8px; font-size: 12px; color: #8a93a5;">Customer: <span style="color: #ffffff; font-weight: 700;">${customerName} (${customerEmail})</span></p>
            <p style="margin: 0; font-size: 12px; color: #8a93a5;">Inventory Guard Action: <span style="color: #10b981; font-weight: 700;">Protected (Stock held at 0, negative overselling prevented)</span></p>
          </div>
          <p style="font-size: 13px; color: #8a93a5; line-height: 1.5;">
            Two customers completed payment within seconds of each other for the final physical unit. Please allocate this item from reserve inventory or issue a refund.
          </p>
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://sharersgym.com/admin/orders" style="display: inline-block; background: #f20d0d; color: #ffffff; padding: 12px 28px; font-weight: 900; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none;">
              REVIEW ORDER IN ADMIN
            </a>
          </div>
        </div>
        <div style="padding: 16px 24px; background: #08090c; border-top: 1px solid #1f232e; text-align: center; font-size: 11px; color: #626a7a;">
          <p style="margin: 0;">Sharers Gym • Real-Time Concurrency Protection</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: ADMIN_EMAIL,
      subject: `🚨 [Urgent Collision Alert] Simultaneous purchase on #${orderId.slice(-8).toUpperCase()}`,
      html,
    });
  },

  /**
   * 7. Admin: Daily Executive Briefing
   */
  async sendDailyExecutiveDigest({
    dateStr,
    totalRevenue,
    paidOrderCount,
    checkInCount,
    newMemberCount,
    lowStockItems = [],
  }: {
    dateStr: string;
    totalRevenue: number;
    paidOrderCount: number;
    checkInCount: number;
    newMemberCount: number;
    lowStockItems?: Array<{ name: string; stock: number }>;
  }) {
    const formattedTotal = `₦${Number(totalRevenue).toLocaleString()}`;
    const lowStockHtml = lowStockItems.length > 0
      ? lowStockItems.map(item => `
          <tr style="border-bottom: 1px solid #1f232e;">
            <td style="padding: 10px 0; color: #ffffff; font-size: 12px;">${item.name}</td>
            <td style="padding: 10px 0; text-align: right; color: ${item.stock <= 0 ? '#ef4444' : '#f59e0b'}; font-weight: 900; font-size: 13px;">
              ${item.stock <= 0 ? 'SOLD OUT' : `${item.stock} left`}
            </td>
          </tr>
        `).join('')
      : `<tr><td colspan="2" style="padding: 12px 0; color: #4ade80; font-size: 12px;">All inventory healthy (all items > 3 units)</td></tr>`;

    const html = `
      <div style="background-color: #0b0c10; font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; border: 1px solid #1f232e;">
        <div style="padding: 32px 24px 20px; text-align: center; border-bottom: 1px solid #1f232e;">
          <div style="display: inline-block; padding: 4px 12px; background: rgba(242, 13, 13, 0.15); border: 1px solid rgba(242, 13, 13, 0.35); color: #f20d0d; font-size: 9px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 10px;">
            DAILY EXECUTIVE BRIEFING
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff;">SHARERS GYM</h1>
          <p style="margin: 6px 0 0; color: #8a93a5; font-size: 12px;">Report for ${dateStr}</p>
        </div>

        <div style="padding: 28px 24px;">
          <!-- Key Metrics Grid -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="width: 50%; padding: 14px; background: #12141c; border: 1px solid #1f232e; vertical-align: top;">
                <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #8a93a5; display: block;">24h Revenue</span>
                <span style="font-size: 22px; font-weight: 900; color: #ffffff; display: block; margin-top: 4px;">${formattedTotal}</span>
                <span style="font-size: 11px; color: #626a7a;">${paidOrderCount} paid orders</span>
              </td>
              <td style="width: 50%; padding: 14px; background: #12141c; border: 1px solid #1f232e; vertical-align: top;">
                <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #8a93a5; display: block;">Gym Check-Ins</span>
                <span style="font-size: 22px; font-weight: 900; color: #ffffff; display: block; margin-top: 4px;">${checkInCount}</span>
                <span style="font-size: 11px; color: #626a7a;">Facility visits</span>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 14px; background: #12141c; border: 1px solid #1f232e; border-top: none;">
                <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #8a93a5; display: block;">New Member Signups</span>
                <span style="font-size: 20px; font-weight: 900; color: #ffffff; display: block; margin-top: 4px;">+${newMemberCount} Members</span>
              </td>
            </tr>
          </table>

          <!-- Low Stock Watchlist -->
          <div style="background: #12141c; border: 1px solid #1f232e; padding: 20px; margin-bottom: 24px;">
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #f20d0d; font-weight: 800; display: block; margin-bottom: 12px;">
              Inventory Watchlist
            </span>
            <table style="width: 100%; border-collapse: collapse;">
              ${lowStockHtml}
            </table>
          </div>

          <div style="text-align: center; margin-top: 28px;">
            <a href="https://sharersgym.com/admin" style="display: inline-block; background: #ffffff; color: #0b0c10; padding: 12px 32px; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; text-decoration: none;">
              OPEN ADMIN COMMAND
            </a>
          </div>
        </div>

        <div style="padding: 16px 24px; background: #08090c; border-top: 1px solid #1f232e; text-align: center; font-size: 11px; color: #626a7a;">
          <p style="margin: 0;">Sharers Gym Operations • Automated Executive Report</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: ADMIN_EMAIL,
      subject: `📊 [Executive Briefing] ${formattedTotal} Revenue • ${checkInCount} Check-ins (${dateStr})`,
      html,
    });
  },

  /**
   * 8. Member: Workout Milestone Reward & VIP Tier Celebration
   */
  async sendMilestoneRewardEmail({
    userEmail,
    userName = 'Champion',
    milestoneCount,
    tierTitle,
    rewardDesc,
  }: {
    userEmail: string;
    userName?: string;
    milestoneCount: number;
    tierTitle: string;
    rewardDesc: string;
  }) {
    const html = `
      <div style="background-color: #0b0c10; font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 580px; margin: 0 auto; color: #ffffff; border: 1px solid #1f232e; overflow: hidden;">
        <div style="padding: 36px 24px 24px; background: radial-gradient(circle at top right, #1f2430 0%, #0b0c10 70%); text-align: center; border-bottom: 1px solid #1f232e;">
          <div style="display: inline-block; padding: 4px 14px; background: rgba(242, 13, 13, 0.15); border: 1px solid rgba(242, 13, 13, 0.4); color: #f20d0d; font-size: 10px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px;">
            MILESTONE UNLOCKED 🏆
          </div>
          <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 2px; color: #ffffff;">SHARERS GYM</h1>
          <p style="margin: 8px 0 0; color: #8a93a5; font-size: 13px;">Official Athlete Recognition</p>
        </div>

        <div style="padding: 32px 24px; text-align: center;">
          <h2 style="font-size: 22px; font-weight: 900; color: #f20d0d; margin: 0 0 8px;">
            ${milestoneCount} WORKOUTS COMPLETED!
          </h2>
          <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin: 0 0 24px;">
            Salute to dedication, <strong>${userName}</strong>. You just crushed workout #${milestoneCount} at Sharers Gym.
          </p>

          <!-- Digital Badge Card -->
          <div style="background: #12141c; border: 1px solid #2a2f3d; padding: 24px; margin: 0 auto 28px; max-width: 400px; border-radius: 8px;">
            <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #8a93a5; margin-bottom: 6px;">
              ATHLETE RANK ACHIEVED
            </div>
            <div style="font-size: 20px; font-weight: 900; letter-spacing: 2px; color: #ffffff; text-transform: uppercase; margin-bottom: 16px;">
              ${tierTitle}
            </div>
            <div style="background: rgba(242, 13, 13, 0.1); border: 1px dashed #f20d0d; padding: 14px; border-radius: 4px;">
              <span style="display: block; font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #f20d0d; margin-bottom: 4px;">
                RECEPTION PERK VOUCHER
              </span>
              <p style="margin: 0; font-size: 13px; font-weight: 700; color: #ffffff;">
                ${rewardDesc}
              </p>
            </div>
          </div>

          <p style="font-size: 12px; color: #8a93a5; margin-bottom: 28px;">
            Show this email to reception on your next visit to claim your complimentary reward.
          </p>

          <a href="https://sharersgym.com/dashboard" style="display: inline-block; background: #f20d0d; color: #ffffff; padding: 12px 32px; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border-radius: 4px;">
            VIEW ATHLETE DASHBOARD
          </a>
        </div>

        <div style="padding: 16px 24px; background: #08090c; border-top: 1px solid #1f232e; text-align: center; font-size: 11px; color: #626a7a;">
          <p style="margin: 0;">Sharers Gym • Discipline • Power • Excellence</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `🏆 Milestone Unlocked: ${milestoneCount} Workouts at Sharers Gym! (${tierTitle})`,
      html,
    });
  },
};
