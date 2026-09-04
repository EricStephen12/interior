import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const DEFAULT_FROM = process.env.EMAIL_FROM || 'SHARERS GYM <support@sharersgym.com>';
const ADMIN_EMAIL = 'sharersmall@gmail.com';

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
        <td style="padding: 14px 0; color: #d4af37; font-size: 13px; font-weight: 700; text-align: right;">₦${Number(item.price * (item.quantity || 1)).toLocaleString()}</td>
      </tr>
    `).join('');

    const html = `
      <div style="background-color: #0b0c10; font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; border: 1px solid #1f232e;">
        <div style="padding: 32px 32px 24px; border-bottom: 1px solid #1f232e; text-align: center;">
          <div style="display: inline-block; padding: 4px 12px; background: rgba(212, 175, 55, 0.12); border: 1px solid rgba(212, 175, 55, 0.3); color: #d4af37; font-size: 9px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px;">
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
                  <td style="padding-top: 18px; font-size: 16px; font-weight: 900; color: #d4af37; text-align: right;">${formattedTotal}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          ${shippingAddress ? `
            <div style="margin-bottom: 28px; padding: 16px 20px; background: #12141a; border-left: 3px solid #d4af37;">
              <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #8a93a5; margin-bottom: 4px;">Delivery Destination</span>
              <p style="margin: 0; font-size: 13px; color: #ffffff; line-height: 1.5;">${shippingAddress}</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin: 36px 0 16px;">
            <a href="https://sharersgym.com/dashboard" style="display: inline-block; background: #ffffff; color: #0b0c10; padding: 14px 32px; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; text-decoration: none;">
              VIEW IN DASHBOARD
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
          <div style="display: inline-block; padding: 4px 12px; background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.35); color: #d4af37; font-size: 9px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px;">
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
              <p style="margin: 4px 0 0; font-size: 20px; font-weight: 900; color: #d4af37; letter-spacing: 2px; font-family: monospace;">${bankDetails.accountNumber}</p>
            </div>
            <div style="margin-bottom: 16px;">
              <span style="font-size: 10px; color: #8a93a5; text-transform: uppercase; letter-spacing: 2px;">Account Name</span>
              <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: #ffffff;">${bankDetails.accountName}</p>
            </div>
            <div style="margin-bottom: 16px; padding-top: 16px; border-top: 1px solid #22252e;">
              <span style="font-size: 10px; color: #8a93a5; text-transform: uppercase; letter-spacing: 2px;">Exact Transfer Amount</span>
              <p style="margin: 4px 0 0; font-size: 22px; font-weight: 900; color: #ffffff;">${formattedTotal}</p>
            </div>
            <div style="padding: 12px; background: rgba(212, 175, 55, 0.08); border: 1px dashed rgba(212, 175, 55, 0.3);">
              <span style="font-size: 9px; color: #d4af37; text-transform: uppercase; letter-spacing: 2px; font-weight: 800;">Transfer Description / Narration</span>
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
        <h2 style="color: #d4af37; margin-top: 0;">⚡ [ADMIN ALERT] New Order Received</h2>
        <p>A new order has been initiated on Sharers Gym storefront.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #14171f; padding: 16px;">
          <tr><td style="padding: 8px; color: #888;">Order ID:</td><td style="padding: 8px; font-weight: bold; color: #fff;">#${orderId}</td></tr>
          <tr><td style="padding: 8px; color: #888;">Customer:</td><td style="padding: 8px; color: #fff;">${userName || 'Customer'} (${userEmail})</td></tr>
          <tr><td style="padding: 8px; color: #888;">Total:</td><td style="padding: 8px; font-size: 18px; color: #d4af37; font-weight: bold;">${formattedTotal}</td></tr>
          <tr><td style="padding: 8px; color: #888;">Method:</td><td style="padding: 8px; color: #fff;">${paymentType}</td></tr>
          <tr><td style="padding: 8px; color: #888;">Current Status:</td><td style="padding: 8px; color: ${status === 'PAID' ? '#4ade80' : '#f59e0b'}; font-weight: bold;">${status}</td></tr>
          ${shippingDetails?.phone ? `<tr><td style="padding: 8px; color: #888;">Phone:</td><td style="padding: 8px; color: #fff;">${shippingDetails.phone}</td></tr>` : ''}
          ${shippingDetails?.address ? `<tr><td style="padding: 8px; color: #888;">Address:</td><td style="padding: 8px; color: #fff;">${shippingDetails.address}</td></tr>` : ''}
        </table>

        ${isManual ? `
          <div style="padding: 12px; background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; margin-bottom: 20px;">
            <strong style="color: #f59e0b;">Action Required:</strong> Please check company bank account for matching transfer narration and verify in the admin orders dashboard.
          </div>
        ` : ''}

        <a href="https://sharersgym.com/admin/orders" style="display: inline-block; background: #d4af37; color: #000; padding: 12px 24px; font-weight: bold; text-decoration: none; text-transform: uppercase; font-size: 12px;">
          Open Admin Orders
        </a>
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
  }: {
    orderId: string;
    userEmail: string;
    userName?: string;
    newStatus: string;
    trackingNote?: string;
  }) {
    const statusLabels: Record<string, { title: string; desc: string; color: string }> = {
      SHIPPED: {
        title: 'YOUR ORDER HAS BEEN DISPATCHED',
        desc: 'Our logistics team has dispatched your gym apparel / items. They are currently en route to your delivery location.',
        color: '#38bdf8',
      },
      DELIVERED: {
        title: 'ORDER DELIVERED SUCCESSFULLY',
        desc: 'Your package has been delivered! We hope you love your new gear. Train hard and enjoy your sessions.',
        color: '#4ade80',
      },
      CANCELLED: {
        title: 'ORDER CANCELLED',
        desc: 'Your order has been cancelled. If a refund is due or if this was in error, please contact member support.',
        color: '#f87171',
      },
    };

    const statusInfo = statusLabels[newStatus] || {
      title: `ORDER STATUS: ${newStatus}`,
      desc: `Your order status has been updated to ${newStatus}.`,
      color: '#d4af37',
    };

    const html = `
      <div style="background-color: #0b0c10; font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #ffffff; border: 1px solid #1f232e;">
        <div style="padding: 32px; border-bottom: 1px solid #1f232e; text-align: center;">
          <div style="display: inline-block; padding: 4px 12px; background: rgba(212, 175, 55, 0.12); color: ${statusInfo.color}; font-size: 10px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px;">
            ${statusInfo.title}
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff;">SHARERS GYM</h1>
          <p style="margin: 8px 0 0; color: #8a93a5; font-size: 13px;">Order #${orderId.slice(-8).toUpperCase()}</p>
        </div>

        <div style="padding: 32px;">
          <p style="font-size: 15px; color: #ffffff; margin-top: 0;">Hello <strong>${userName}</strong>,</p>
          <p style="font-size: 14px; color: #a1a9b8; line-height: 1.6;">${statusInfo.desc}</p>

          ${trackingNote ? `
            <div style="margin: 24px 0; padding: 16px; background: #12141a; border-left: 3px solid ${statusInfo.color};">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #8a93a5;">Courier / Tracking Details</span>
              <p style="margin: 4px 0 0; font-size: 13px; color: #ffffff;">${trackingNote}</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 32px;">
            <a href="https://sharersgym.com/dashboard" style="display: inline-block; background: #ffffff; color: #000; padding: 12px 28px; font-weight: 900; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none;">
              VIEW MY ORDERS
            </a>
          </div>
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
          <div style="display: inline-block; padding: 4px 12px; background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.35); color: #d4af37; font-size: 9px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 10px;">
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
            <div style="font-size: 10px; font-weight: 800; letter-spacing: 2px; color: #d4af37; text-transform: uppercase; margin-bottom: 6px;">
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
              <div style="padding: 24px; background: #1f2430; margin-bottom: 18px; border: 1px dashed #d4af37;">
                <p style="margin: 0; font-family: monospace; font-size: 14px; color: #d4af37;">SHARERS_PASS_${memberId}</p>
              </div>
            `}

            <div style="border-top: 1px solid #222735; padding-top: 16px; display: flex; justify-content: space-between; text-align: left;">
              <div>
                <span style="font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #8a93a5; display: block;">Credits Remaining</span>
                <span style="font-size: 18px; font-weight: 900; color: #ffffff;">${credits} SESSIONS</span>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #8a93a5; display: block;">Tier</span>
                <span style="font-size: 14px; font-weight: 800; color: #d4af37; text-transform: uppercase;">${tier}</span>
              </div>
            </div>
          </div>

          <div style="margin-top: 24px; padding: 16px; background: #12141c; border-left: 3px solid #d4af37; font-size: 12px; color: #9fa8b8; line-height: 1.6;">
            <strong style="color: #ffffff;">At Reception:</strong> Show this QR code directly from your phone screen to the reception scanner for automated entry check-in.
          </div>

          <div style="text-align: center; margin-top: 28px;">
            <a href="https://sharersgym.com/dashboard" style="display: inline-block; background: #d4af37; color: #0b0c10; padding: 12px 32px; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; text-decoration: none;">
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
};
