import { type NextRequest, NextResponse } from "next/server"

// Email service configuration (using Resend as example)
const RESEND_API_KEY = process.env.RESEND_API_KEY || "your-resend-api-key"
const FROM_EMAIL = "noreply@singkongkejumbahwiryo.com"
const ADMIN_EMAIL = "admin@singkongkejumbahwiryo.com"

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface Customer {
  name: string
  phone: string
  email: string
  address: string
  city: string
  province: string
  postalCode: string
  notes: string
}

interface OrderData {
  customer: Customer
  items: OrderItem[]
  shipping: {
    method: string
    cost: number
  }
  payment: string
  total: number
  orderNumber: string
}

// Customer confirmation email template
function generateCustomerEmailHTML(orderData: OrderData): string {
  const { customer, items, shipping, payment, total, orderNumber } = orderData

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Konfirmasi Pesanan - Singkong Keju Mbah Wiryo</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #f97316 0%, #eab308 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content {
          padding: 30px 20px;
        }
        .order-number {
          background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
          border: 2px solid #f59e0b;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          margin-bottom: 25px;
        }
        .order-number h2 {
          margin: 0;
          color: #92400e;
          font-size: 20px;
        }
        .section {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }
        .section:last-child {
          border-bottom: none;
        }
        .section h3 {
          color: #92400e;
          margin-bottom: 15px;
          font-size: 18px;
          font-weight: 600;
        }
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .item:last-child {
          border-bottom: none;
        }
        .item-info {
          flex: 1;
        }
        .item-name {
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }
        .item-details {
          color: #6b7280;
          font-size: 14px;
        }
        .item-total {
          font-weight: 600;
          color: #92400e;
        }
        .total-section {
          background: #fef3c7;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .total-row.final {
          border-top: 2px solid #f59e0b;
          padding-top: 12px;
          margin-top: 12px;
          font-size: 18px;
          font-weight: bold;
          color: #92400e;
        }
        .next-steps {
          background: #ecfdf5;
          border: 1px solid #10b981;
          border-radius: 8px;
          padding: 20px;
          margin-top: 25px;
        }
        .next-steps h4 {
          color: #065f46;
          margin-top: 0;
          margin-bottom: 15px;
        }
        .next-steps ol {
          margin: 0;
          padding-left: 20px;
          color: #047857;
        }
        .next-steps li {
          margin-bottom: 8px;
        }
        .contact-info {
          background: #f3f4f6;
          border-radius: 8px;
          padding: 20px;
          margin-top: 25px;
          text-align: center;
        }
        .contact-info h4 {
          color: #374151;
          margin-top: 0;
          margin-bottom: 15px;
        }
        .whatsapp-btn {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin-top: 10px;
        }
        .footer {
          background: #374151;
          color: white;
          padding: 20px;
          text-align: center;
          font-size: 14px;
        }
        .footer a {
          color: #fbbf24;
          text-decoration: none;
        }
        @media (max-width: 600px) {
          .item {
            flex-direction: column;
            align-items: flex-start;
          }
          .item-total {
            margin-top: 8px;
          }
          .total-row {
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Pesanan Berhasil Diterima!</h1>
          <p>Terima kasih telah mempercayai Singkong Keju Mbah Wiryo</p>
        </div>
        
        <div class="content">
          <div class="order-number">
            <h2>Nomor Pesanan: ${orderNumber}</h2>
          </div>
          
          <div class="section">
            <h3>📋 Detail Pesanan</h3>
            ${items
              .map(
                (item) => `
              <div class="item">
                <div class="item-info">
                  <div class="item-name">${item.name}</div>
                  <div class="item-details">Qty: ${item.quantity} × Rp ${item.price.toLocaleString("id-ID")}</div>
                </div>
                <div class="item-total">Rp ${(item.price * item.quantity).toLocaleString("id-ID")}</div>
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div class="section">
            <h3>📍 Informasi Pengiriman</h3>
            <p><strong>Nama:</strong> ${customer.name}</p>
            <p><strong>Telepon:</strong> ${customer.phone}</p>
            <p><strong>Alamat:</strong> ${customer.address}, ${customer.city}</p>
            <p><strong>Metode Pengiriman:</strong> ${shipping.method}</p>
            ${customer.notes ? `<p><strong>Catatan:</strong> ${customer.notes}</p>` : ""}
          </div>
          
          <div class="section">
            <h3>💳 Metode Pembayaran</h3>
            <p>${payment}</p>
          </div>
          
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>Rp ${(total - shipping.cost).toLocaleString("id-ID")}</span>
            </div>
            <div class="total-row">
              <span>Ongkos Kirim:</span>
              <span>Rp ${shipping.cost.toLocaleString("id-ID")}</span>
            </div>
            <div class="total-row final">
              <span>Total Pembayaran:</span>
              <span>Rp ${total.toLocaleString("id-ID")}</span>
            </div>
          </div>
          
          <div class="next-steps">
            <h4>🚀 Langkah Selanjutnya:</h4>
            <ol>
              <li>Tim kami akan menghubungi Anda via WhatsApp dalam 1-2 jam untuk konfirmasi</li>
              <li>Lakukan pembayaran sesuai instruksi yang akan diberikan</li>
              <li>Pesanan akan diproses setelah pembayaran dikonfirmasi</li>
              <li>Produk akan dikirim sesuai metode pengiriman yang dipilih</li>
              <li>Anda akan mendapat nomor resi untuk tracking pengiriman</li>
            </ol>
          </div>
          
          <div class="contact-info">
            <h4>📞 Butuh Bantuan?</h4>
            <p>Hubungi customer service kami:</p>
            <a href="https://wa.me/6281234567890" class="whatsapp-btn">💬 Chat WhatsApp</a>
            <p style="margin-top: 15px; font-size: 14px;">
              Email: halo@singkongkejumbahwiryo.com<br>
              Jam Operasional: 08.00 - 20.00 WIB
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p>&copy; 2025 Singkong Keju Frozen Mbah Wiryo. Semua Hak Dilindungi.</p>
          <p>
            <a href="#">Kebijakan Privasi</a> | 
            <a href="#">Syarat & Ketentuan</a> | 
            <a href="#">FAQ</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Admin notification email template
function generateAdminEmailHTML(orderData: OrderData): string {
  const { customer, items, shipping, payment, total, orderNumber } = orderData

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pesanan Baru - ${orderNumber}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .alert {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 20px;
          color: #991b1b;
          font-weight: 600;
        }
        .section {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e5e7eb;
        }
        .section:last-child {
          border-bottom: none;
        }
        .section h3 {
          color: #dc2626;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          padding: 8px 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        .total {
          background: #fef3c7;
          padding: 15px;
          border-radius: 6px;
          margin-top: 15px;
          font-weight: 600;
          font-size: 18px;
          color: #92400e;
          text-align: center;
        }
        .action-buttons {
          text-align: center;
          margin-top: 20px;
        }
        .btn {
          display: inline-block;
          padding: 10px 20px;
          margin: 5px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
        }
        .btn-whatsapp {
          background: #10b981;
          color: white;
        }
        .btn-email {
          background: #3b82f6;
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 PESANAN BARU MASUK!</h1>
          <p>Nomor Pesanan: ${orderNumber}</p>
        </div>
        
        <div class="content">
          <div class="alert">
            ⚡ SEGERA TINDAK LANJUTI: Hubungi pelanggan dalam 1-2 jam!
          </div>
          
          <div class="section">
            <h3>👤 Data Pelanggan</h3>
            <p><strong>Nama:</strong> ${customer.name}</p>
            <p><strong>Telepon:</strong> ${customer.phone}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Alamat:</strong> ${customer.address}, ${customer.city}</p>
            ${customer.notes ? `<p><strong>Catatan:</strong> ${customer.notes}</p>` : ""}
          </div>
          
          <div class="section">
            <h3>📦 Detail Pesanan</h3>
            <table>
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Qty</th>
                  <th>Harga</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>Rp ${item.price.toLocaleString("id-ID")}</td>
                    <td>Rp ${(item.price * item.quantity).toLocaleString("id-ID")}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
            
            <div class="total">
              Total Pesanan: Rp ${total.toLocaleString("id-ID")}
              <br><small>Termasuk ongkir ${shipping.method}: Rp ${shipping.cost.toLocaleString("id-ID")}</small>
            </div>
          </div>
          
          <div class="section">
            <h3>🚚 Pengiriman & Pembayaran</h3>
            <p><strong>Metode Pengiriman:</strong> ${shipping.method}</p>
            <p><strong>Metode Pembayaran:</strong> ${payment}</p>
          </div>
          
          <div class="action-buttons">
            <a href="https://wa.me/${customer.phone.replace(/^0/, "62")}" class="btn btn-whatsapp">
              💬 Hubungi via WhatsApp
            </a>
            <a href="mailto:${customer.email}" class="btn btn-email">
              📧 Kirim Email
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json()

    // Validate required fields
    if (!orderData.customer.email) {
      return NextResponse.json({ error: "Email pelanggan diperlukan" }, { status: 400 })
    }

    // Send customer confirmation email
    const customerEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [orderData.customer.email],
        subject: `Konfirmasi Pesanan ${orderData.orderNumber} - Singkong Keju Mbah Wiryo`,
        html: generateCustomerEmailHTML(orderData),
      }),
    })

    // Send admin notification email
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `🚨 PESANAN BARU: ${orderData.orderNumber} - ${orderData.customer.name}`,
        html: generateAdminEmailHTML(orderData),
      }),
    })

    const customerResult = await customerEmailResponse.json()
    const adminResult = await adminEmailResponse.json()

    if (customerEmailResponse.ok && adminEmailResponse.ok) {
      return NextResponse.json({
        success: true,
        message: "Email konfirmasi berhasil dikirim",
        customerEmailId: customerResult.id,
        adminEmailId: adminResult.id,
      })
    } else {
      console.error("Email sending failed:", { customerResult, adminResult })
      return NextResponse.json(
        {
          error: "Gagal mengirim email",
          details: { customerResult, adminResult },
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
