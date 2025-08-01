import type React from "react"

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

interface OrderConfirmationProps {
  orderNumber: string
  customer: Customer
  items: OrderItem[]
  shipping: {
    method: string
    cost: number
  }
  payment: string
  total: number
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationProps> = ({
  orderNumber,
  customer,
  items,
  shipping,
  payment,
  total,
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #f97316 0%, #eab308 100%)",
          color: "white",
          padding: "30px 20px",
          textAlign: "center",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "28px" }}>🎉 Pesanan Berhasil!</h1>
        <p style={{ margin: "10px 0 0 0", opacity: 0.9 }}>Terima kasih telah mempercayai Singkong Keju Mbah Wiryo</p>
      </div>

      {/* Content */}
      <div style={{ padding: "30px 20px", backgroundColor: "white" }}>
        {/* Order Number */}
        <div
          style={{
            background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
            border: "2px solid #f59e0b",
            borderRadius: "8px",
            padding: "15px",
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <h2 style={{ margin: 0, color: "#92400e" }}>Nomor Pesanan: {orderNumber}</h2>
        </div>

        {/* Order Items */}
        <div style={{ marginBottom: "25px" }}>
          <h3 style={{ color: "#92400e", marginBottom: "15px" }}>📋 Detail Pesanan</h3>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: "#374151" }}>{item.name}</div>
                <div style={{ color: "#6b7280", fontSize: "14px" }}>
                  Qty: {item.quantity} × Rp {item.price.toLocaleString("id-ID")}
                </div>
              </div>
              <div style={{ fontWeight: 600, color: "#92400e" }}>
                Rp {(item.price * item.quantity).toLocaleString("id-ID")}
              </div>
            </div>
          ))}
        </div>

        {/* Customer Info */}
        <div style={{ marginBottom: "25px" }}>
          <h3 style={{ color: "#92400e", marginBottom: "15px" }}>📍 Informasi Pengiriman</h3>
          <p>
            <strong>Nama:</strong> {customer.name}
          </p>
          <p>
            <strong>Telepon:</strong> {customer.phone}
          </p>
          <p>
            <strong>Alamat:</strong> {customer.address}, {customer.city}
          </p>
          <p>
            <strong>Metode Pengiriman:</strong> {shipping.method}
          </p>
          {customer.notes && (
            <p>
              <strong>Catatan:</strong> {customer.notes}
            </p>
          )}
        </div>

        {/* Total */}
        <div
          style={{
            background: "#fef3c7",
            borderRadius: "8px",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span>Subtotal:</span>
            <span>Rp {(total - shipping.cost).toLocaleString("id-ID")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span>Ongkos Kirim:</span>
            <span>Rp {shipping.cost.toLocaleString("id-ID")}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "2px solid #f59e0b",
              paddingTop: "12px",
              marginTop: "12px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#92400e",
            }}
          >
            <span>Total Pembayaran:</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Next Steps */}
        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #10b981",
            borderRadius: "8px",
            padding: "20px",
            marginTop: "25px",
          }}
        >
          <h4 style={{ color: "#065f46", marginTop: 0 }}>🚀 Langkah Selanjutnya:</h4>
          <ol style={{ color: "#047857", paddingLeft: "20px" }}>
            <li>Tim kami akan menghubungi Anda via WhatsApp dalam 1-2 jam</li>
            <li>Lakukan pembayaran sesuai instruksi yang diberikan</li>
            <li>Pesanan diproses setelah pembayaran dikonfirmasi</li>
            <li>Produk dikirim sesuai metode yang dipilih</li>
            <li>Anda akan mendapat nomor resi untuk tracking</li>
          </ol>
        </div>

        {/* Contact */}
        <div
          style={{
            background: "#f3f4f6",
            borderRadius: "8px",
            padding: "20px",
            marginTop: "25px",
            textAlign: "center",
          }}
        >
          <h4 style={{ color: "#374151", marginTop: 0 }}>📞 Butuh Bantuan?</h4>
          <p>Hubungi customer service kami:</p>
          <a
            href="https://wa.me/6281234567890"
            style={{
              display: "inline-block",
              background: "#10b981",
              color: "white",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: 600,
              marginTop: "10px",
            }}
          >
            💬 Chat WhatsApp
          </a>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "#374151",
          color: "white",
          padding: "20px",
          textAlign: "center",
          fontSize: "14px",
          borderRadius: "0 0 12px 12px",
        }}
      >
        <p>&copy; 2025 Singkong Keju Frozen Mbah Wiryo. Semua Hak Dilindungi.</p>
      </div>
    </div>
  )
}
