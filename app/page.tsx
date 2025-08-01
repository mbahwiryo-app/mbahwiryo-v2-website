"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Shield, Mail, MessageCircle, Heart, Award, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SingkongKejuLanding() {
  const WHATSAPP_NUMBER = "+6282147566278"
  // Order Form Component
  const OrderForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      notes: "",
    })

    const [orderItems, setOrderItems] = useState([
      { id: 1, name: "Singkong Keju Original", price: 25000, quantity: 1, image: "/images/singkong-keju-package.jpg" },
      { id: 2, name: "Kroket Ragout Ayam", price: 30000, quantity: 0, image: "/images/kroket-frozen.jpg" },
    ])

    const [shippingMethod, setShippingMethod] = useState("regular")
    const [paymentMethod, setPaymentMethod] = useState("transfer")

    const shippingCosts = {
      regular: 15000,
      express: 25000,
      same_day: 35000,
    }

    const updateQuantity = (id: number, newQuantity: number) => {
      setOrderItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item)),
      )
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = shippingCosts[shippingMethod as keyof typeof shippingCosts]
    const total = subtotal + shippingCost

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const orderData = {
        customer: formData,
        items: orderItems.filter((item) => item.quantity > 0),
        shipping: { method: shippingMethod, cost: shippingCost },
        payment: paymentMethod,
        total: total,
      }

      // Create WhatsApp message
      const message = `*PESANAN BARU - Singkong Keju Mbah Wiryo*

*Data Pelanggan:*
Nama: ${formData.name}
HP: ${formData.phone}
Email: ${formData.email}
Alamat: ${formData.address}, ${formData.city}, ${formData.province} ${formData.postalCode}

*Pesanan:*
${orderItems
  .filter((item) => item.quantity > 0)
  .map((item) => `• ${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString("id-ID")}`)
  .join("\n")}

*Ringkasan:*
Subtotal: Rp ${subtotal.toLocaleString("id-ID")}
Ongkir (${shippingMethod}): Rp ${shippingCost.toLocaleString("id-ID")}
*TOTAL: Rp ${total.toLocaleString("id-ID")}*

Metode Pembayaran: ${paymentMethod}
${formData.notes ? `Catatan: ${formData.notes}` : ""}

Terima kasih! 🙏`

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")

      // Send confirmation email
      try {
        const emailResponse = await fetch("/api/send-confirmation-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer: formData,
            items: orderItems.filter((item) => item.quantity > 0),
            shipping: { method: shippingMethod, cost: shippingCost },
            payment: paymentMethod,
            total: total,
            orderNumber: `MW${Date.now()}`,
          }),
        })

        if (emailResponse.ok) {
          // Show success message
          alert("Pesanan berhasil dikirim! Silakan cek email Anda untuk konfirmasi.")
        } else {
          // Show warning but still proceed
          alert("Pesanan dikirim via WhatsApp, namun email konfirmasi gagal terkirim.")
        }
      } catch (error) {
        console.error("Email sending failed:", error)
        alert("Pesanan dikirim via WhatsApp, namun email konfirmasi gagal terkirim.")
      }

      onClose()
    }

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-orange-200 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-orange-900">Form Pemesanan</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center text-orange-600"
              >
                ✕
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Product Selection */}
            <div>
              <h3 className="text-xl font-bold text-orange-900 mb-4">Pilih Produk</h3>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-orange-200 rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-900">{item.name}</h4>
                      <p className="text-orange-600">Rp {item.price.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center text-orange-600"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center text-orange-600"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-900">
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="text-xl font-bold text-orange-900 mb-4">Data Pelanggan</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">No. WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Kota *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="Nama kota"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-orange-700 mb-2">Alamat Lengkap *</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 h-20 resize-none"
                    placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div>
              <h3 className="text-xl font-bold text-orange-900 mb-4">Metode Pengiriman</h3>
              <div className="space-y-3">
                {[
                  { id: "regular", name: "Regular (3-5 hari)", price: 15000 },
                  { id: "express", name: "Express (1-2 hari)", price: 25000 },
                  { id: "same_day", name: "Same Day (Khusus Jakarta)", price: 35000 },
                ].map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center space-x-3 p-3 border border-orange-200 rounded-lg cursor-pointer hover:bg-orange-50"
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={shippingMethod === method.id}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="text-orange-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-orange-900">{method.name}</div>
                      <div className="text-orange-600">Rp {method.price.toLocaleString("id-ID")}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-xl font-bold text-orange-900 mb-4">Metode Pembayaran</h3>
              <div className="space-y-3">
                {[
                  { id: "transfer", name: "Transfer Bank", desc: "BCA, Mandiri, BRI" },
                  { id: "ewallet", name: "E-Wallet", desc: "GoPay, OVO, DANA" },
                  { id: "cod", name: "COD", desc: "Bayar di tempat (area terbatas)" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center space-x-3 p-3 border border-orange-200 rounded-lg cursor-pointer hover:bg-orange-50"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-500"
                    />
                    <div>
                      <div className="font-semibold text-orange-900">{method.name}</div>
                      <div className="text-sm text-orange-600">{method.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-2">Catatan Tambahan</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 h-20 resize-none"
                placeholder="Catatan khusus untuk pesanan Anda..."
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-orange-900 mb-4">Ringkasan Pesanan</h3>
              <div className="space-y-2">
                {orderItems
                  .filter((item) => item.quantity > 0)
                  .map((item) => (
                    <div key={item.id} className="flex justify-between text-orange-700">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                <div className="border-t border-orange-200 pt-2 mt-2">
                  <div className="flex justify-between text-orange-700">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-orange-700">
                    <span>Ongkos Kirim</span>
                    <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-orange-900 border-t border-orange-300 pt-2 mt-2">
                    <span>Total</span>
                    <span>Rp {total.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-6 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={orderItems.every((item) => item.quantity === 0)}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pesan via WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Add state for order form
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Add smooth scroll functionality and active section tracking
  const [activeSection, setActiveSection] = useState("")

  const smoothScrollTo = useCallback((elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      const headerHeight = 80 // Height of sticky header
      const elementPosition = element.offsetTop - headerHeight

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
  }, [])

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["produk", "cara-penyajian", "testimoni", "kemitraan", "kontak"]
      const scrollPosition = window.scrollY + 100 // Offset for header

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once to set initial active section

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Kemitraan Form State
  const [partnerForm, setPartnerForm] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    city: "",
    message: "",
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/mbah-wiryo-logo.png"
              alt="Mbah Wiryo Logo"
              width={50}
              height={50}
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-orange-800">Mbah Wiryo</h1>
              <p className="text-xs text-orange-600">Premium Cassava Cheese</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => smoothScrollTo("produk")}
              className={`font-medium transition-colors ${
                activeSection === "produk"
                  ? "text-orange-900 border-b-2 border-orange-500"
                  : "text-orange-700 hover:text-orange-900"
              }`}
            >
              Produk
            </button>
            <button
              onClick={() => smoothScrollTo("cara-penyajian")}
              className={`font-medium transition-colors ${
                activeSection === "cara-penyajian"
                  ? "text-orange-900 border-b-2 border-orange-500"
                  : "text-orange-700 hover:text-orange-900"
              }`}
            >
              Cara Penyajian
            </button>
            <button
              onClick={() => smoothScrollTo("testimoni")}
              className={`font-medium transition-colors ${
                activeSection === "testimoni"
                  ? "text-orange-900 border-b-2 border-orange-500"
                  : "text-orange-700 hover:text-orange-900"
              }`}
            >
              Testimoni
            </button>
            <button
              onClick={() => smoothScrollTo("kemitraan")}
              className={`font-medium transition-colors ${
                activeSection === "kemitraan"
                  ? "text-orange-900 border-b-2 border-orange-500"
                  : "text-orange-700 hover:text-orange-900"
              }`}
            >
              Kemitraan
            </button>
            <button
              onClick={() => smoothScrollTo("kontak")}
              className={`font-medium transition-colors ${
                activeSection === "kontak"
                  ? "text-orange-900 border-b-2 border-orange-500"
                  : "text-orange-700 hover:text-orange-900"
              }`}
            >
              Kontak
            </button>
          </nav>
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-orange-700 hover:text-orange-900 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <Button
            onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`, "_blank")}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Pesan Sekarang
          </Button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-orange-200 shadow-lg">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => {
                smoothScrollTo("produk")
                setIsMobileMenuOpen(false)
              }}
              className={`block w-full text-left py-2 px-3 rounded-lg font-medium transition-colors ${
                activeSection === "produk"
                  ? "bg-orange-100 text-orange-900"
                  : "text-orange-700 hover:bg-orange-50 hover:text-orange-900"
              }`}
            >
              Produk
            </button>
            <button
              onClick={() => {
                smoothScrollTo("cara-penyajian")
                setIsMobileMenuOpen(false)
              }}
              className={`block w-full text-left py-2 px-3 rounded-lg font-medium transition-colors ${
                activeSection === "cara-penyajian"
                  ? "bg-orange-100 text-orange-900"
                  : "text-orange-700 hover:bg-orange-50 hover:text-orange-900"
              }`}
            >
              Cara Penyajian
            </button>
            <button
              onClick={() => {
                smoothScrollTo("testimoni")
                setIsMobileMenuOpen(false)
              }}
              className={`block w-full text-left py-2 px-3 rounded-lg font-medium transition-colors ${
                activeSection === "testimoni"
                  ? "bg-orange-100 text-orange-900"
                  : "text-orange-700 hover:bg-orange-50 hover:text-orange-900"
              }`}
            >
              Testimoni
            </button>
            <button
              onClick={() => {
                smoothScrollTo("kemitraan")
                setIsMobileMenuOpen(false)
              }}
              className={`block w-full text-left py-2 px-3 rounded-lg font-medium transition-colors ${
                activeSection === "kemitraan"
                  ? "bg-orange-100 text-orange-900"
                  : "text-orange-700 hover:bg-orange-50 hover:text-orange-900"
              }`}
            >
              Kemitraan
            </button>
            <button
              onClick={() => {
                smoothScrollTo("kontak")
                setIsMobileMenuOpen(false)
              }}
              className={`block w-full text-left py-2 px-3 rounded-lg font-medium transition-colors ${
                activeSection === "kontak"
                  ? "bg-orange-100 text-orange-900"
                  : "text-orange-700 hover:bg-orange-50 hover:text-orange-900"
              }`}
            >
              Kontak
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-orange-100 via-yellow-100 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-orange-500 text-white px-4 py-2 text-sm">🔥 Produk Terlaris #1</Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-orange-900 leading-tight">
                Singkong Keju Frozen Mbah Wiryo:
                <span className="text-yellow-600"> Lezatnya Warisan, Praktisnya Masa Kini!</span>
              </h1>
              <p className="text-lg text-orange-700 leading-relaxed">
                Nikmati kelezatan singkong keju legendaris Mbah Wiryo, kini hadir dalam kemasan beku yang siap saji
                kapan saja. Cemilan sempurna untuk keluarga tercinta!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-4 text-lg"
                  onClick={() => setIsOrderFormOpen(true)}
                >
                  🛒 Pesan Sekarang
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-orange-500 text-orange-700 hover:bg-orange-50 px-8 py-4 text-lg bg-transparent"
                  onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`, "_blank")}
                >
                  📱 Chat WhatsApp
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-orange-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.9/5</span>
                  <span>(2,847 ulasan)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Truck className="w-4 h-4" />
                  <span>Gratis Ongkir Jawa</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/singkong-keju-package.jpg"
                  alt="Singkong Keju Frozen Mbah Wiryo"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-full p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">100%</div>
                  <div className="text-xs text-orange-500">Halal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Utama Section */}
      <section id="produk" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-yellow-500 text-white mb-4">Keunggulan Produk</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-900 mb-4">
              Mengapa Singkong Keju Mbah Wiryo Pilihan Terbaik Anda?
            </h2>
            <p className="text-lg text-orange-700 max-w-2xl mx-auto">
              Lebih dari sekadar cemilan, ini adalah warisan cita rasa yang telah dipercaya ribuan keluarga Indonesia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-orange-900 mb-2">Praktis & Cepat Saji</h3>
                <p className="text-orange-700">
                  Cukup goreng, sajikan! Tanpa ribet, kelezatan langsung tersaji di meja Anda dalam hitungan menit.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-orange-900 mb-2">Resep Warisan Keluarga</h3>
                <p className="text-orange-700">
                  Diolah dengan resep asli Mbah Wiryo yang turun-temurun, menghadirkan cita rasa otentik tak terlupakan.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-orange-900 mb-2">Tahan Lama & Selalu Fresh</h3>
                <p className="text-orange-700">
                  Dikemas beku secara higienis, menjaga kualitas dan kesegaran hingga berbulan-bulan di freezer Anda.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-orange-900 mb-2">Kualitas Premium Terjamin</h3>
                <p className="text-orange-700">
                  Terbuat dari singkong pilihan terbaik dan keju berkualitas tinggi, setiap gigitan adalah pengalaman
                  rasa yang istimewa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cara Penyajian Section */}
      <section id="cara-penyajian" className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-orange-500 text-white mb-4">Mudah & Praktis</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-900 mb-4">
              Semudah 1-2-3-4! Cara Menikmati Singkong Keju Mbah Wiryo
            </h2>
            <p className="text-lg text-orange-700 max-w-2xl mx-auto">
              Tidak perlu keahlian khusus, siapa saja bisa menyajikan kelezatan ini dengan sempurna
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-900 mb-2">Keluarkan dari Freezer</h3>
                  <p className="text-orange-700">
                    Keluarkan Singkong Keju Mbah Wiryo dari freezer. Biarkan sebentar di suhu ruang (sekitar 5-10 menit)
                    agar tidak terlalu beku.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-900 mb-2">Panaskan Minyak</h3>
                  <p className="text-orange-700">
                    Panaskan minyak goreng secukupnya di wajan dengan api sedang. Pastikan minyak sudah cukup panas
                    sebelum memasukkan singkong keju.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-900 mb-2">Goreng Hingga Golden</h3>
                  <p className="text-orange-700">
                    Goreng Singkong Keju hingga berwarna kuning keemasan. Balik sesekali agar matang merata dan tekstur
                    luar renyah sempurna.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-900 mb-2">Siap Dinikmati!</h3>
                  <p className="text-orange-700">
                    Angkat, tiriskan, dan Singkong Keju Mbah Wiryo siap dinikmati selagi hangat bersama keluarga
                    tercinta!
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/images/cara-memasak.jpg"
                alt="Cara Memasak Singkong Keju"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-orange-700 font-semibold">Total waktu: Hanya 10-15 menit!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimoni Section */}
      <section id="testimoni" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-yellow-500 text-white mb-4">Kepuasan Pelanggan</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-900 mb-4">
              Apa Kata Mereka Tentang Singkong Keju Mbah Wiryo?
            </h2>
            <p className="text-lg text-orange-700 max-w-2xl mx-auto">
              Ribuan keluarga telah merasakan kelezatan dan kepraktisan produk kami
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-orange-600 font-semibold">5.0</span>
                </div>
                <p className="text-orange-700 mb-4 italic">
                  "Rasanya autentik banget, persis kayak bikinan nenek di kampung! Anak-anak langsung lahap minta
                  nambah. Praktis banget buat cemilan sore."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-semibold text-orange-900">Ibu Ani</div>
                    <div className="text-sm text-orange-600">Jakarta</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-orange-600 font-semibold">5.0</span>
                </div>
                <p className="text-orange-700 mb-4 italic">
                  "Praktis banget buat cemilan sore atau pas ada tamu mendadak. Gak pernah nyangka singkong beku bisa
                  seenak ini. Recommended!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                    B
                  </div>
                  <div>
                    <div className="font-semibold text-orange-900">Bapak Budi</div>
                    <div className="text-sm text-orange-600">Surabaya</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
                  </div>
                  <span className="ml-2 text-sm text-orange-600 font-semibold">4.5</span>
                </div>
                <p className="text-orange-700 mb-4 italic">
                  "Kejunya lumer di mulut, gurihnya pas, dan yang penting halal. Anak-anak suka banget, jadi cemilan
                  favorit keluarga!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <div className="font-semibold text-orange-900">Mbak Siti</div>
                    <div className="text-sm text-orange-600">Bandung</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full px-8 py-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">4.9/5</div>
                <div className="text-sm text-orange-500">Rating Rata-rata</div>
              </div>
              <div className="w-px h-8 bg-orange-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">2,847</div>
                <div className="text-sm text-orange-500">Ulasan Positif</div>
              </div>
              <div className="w-px h-8 bg-orange-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-orange-500">Repeat Order</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kemitraan Section */}
      <section id="kemitraan" className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-orange-500 text-white mb-4">Peluang Bisnis</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-900 mb-4">
              Raih Kesuksesan Bersama Mbah Wiryo! Jadilah Mitra Resmi Kami
            </h2>
            <p className="text-lg text-orange-700 max-w-2xl mx-auto">
              Jadilah bagian dari keluarga besar Singkong Keju Mbah Wiryo dan nikmati berbagai keuntungan menjadi
              reseller atau mitra kami
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">💰</span>
                  </div>
                  <h3 className="text-lg font-bold text-orange-900 mb-2">Potensi Keuntungan Menarik</h3>
                  <p className="text-orange-700 text-sm">
                    Margin keuntungan hingga 40% dengan produk yang selalu laris manis
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">🚀</span>
                  </div>
                  <h3 className="text-lg font-bold text-orange-900 mb-2">Produk Inovatif & Laris</h3>
                  <p className="text-orange-700 text-sm">Produk unik dengan demand tinggi dan kompetitor terbatas</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">📈</span>
                  </div>
                  <h3 className="text-lg font-bold text-orange-900 mb-2">Dukungan Pemasaran Optimal</h3>
                  <p className="text-orange-700 text-sm">Materi promosi, training, dan support marketing lengkap</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">🎯</span>
                  </div>
                  <h3 className="text-lg font-bold text-orange-900 mb-2">Target Pasar Luas</h3>
                  <p className="text-orange-700 text-sm">Semua kalangan menyukai cemilan praktis dan lezat ini</p>
                </div>
              </div>
            </div>

            <Card className="bg-white shadow-2xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-orange-900 mb-6 text-center">Daftar Mitra Sekarang!</h3>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault() // Prevent default form submission
                    const message = `*PENDAFTARAN MITRA BARU - Singkong Keju Mbah Wiryo*\n\n*Data Pendaftar:*\nNama Lengkap: ${partnerForm.fullName}\nEmail: ${partnerForm.email}\nNo. WhatsApp: ${partnerForm.whatsapp}\nKota: ${partnerForm.city}\n${partnerForm.message ? `Pesan: ${partnerForm.message}\n` : ""}\nMohon diproses untuk pendaftaran mitra. Terima kasih! 🙏`
                    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${encodeURIComponent(message)}`
                    window.open(whatsappUrl, "_blank")
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">Nama Lengkap</label>
                    <Input
                      placeholder="Masukkan nama lengkap Anda"
                      className="border-orange-200 focus:border-orange-500"
                      value={partnerForm.fullName}
                      onChange={(e) => setPartnerForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      className="border-orange-200 focus:border-orange-500"
                      value={partnerForm.email}
                      onChange={(e) => setPartnerForm((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">No. WhatsApp</label>
                    <Input
                      placeholder="08xxxxxxxxxx"
                      className="border-orange-200 focus:border-orange-500"
                      value={partnerForm.whatsapp}
                      onChange={(e) => setPartnerForm((prev) => ({ ...prev, whatsapp: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">Kota</label>
                    <Input
                      placeholder="Kota tempat tinggal"
                      className="border-orange-200 focus:border-orange-500"
                      value={partnerForm.city}
                      onChange={(e) => setPartnerForm((prev) => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">Pesan (Opsional)</label>
                    <textarea
                      placeholder="Ceritakan motivasi Anda bergabung..."
                      className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:border-orange-500 resize-none h-20"
                      value={partnerForm.message}
                      onChange={(e) => setPartnerForm((prev) => ({ ...prev, message: e.target.value }))}
                    ></textarea>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-3"
                  >
                    Daftar Sekarang dan Mulai Bisnis Anda!
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-yellow-500 text-white mb-4">Pertanyaan Umum</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-900 mb-4">
              Pertanyaan Umum Seputar Singkong Keju Mbah Wiryo
            </h2>
            <p className="text-lg text-orange-700 max-w-2xl mx-auto">
              Temukan jawaban atas pertanyaan yang sering diajukan pelanggan kami
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-orange-200 rounded-lg px-6">
                <AccordionTrigger className="text-orange-900 font-semibold hover:text-orange-700">
                  Apakah produk Singkong Keju Mbah Wiryo halal?
                </AccordionTrigger>
                <AccordionContent className="text-orange-700">
                  Ya, semua produk kami diolah dengan bahan-bahan halal dan proses yang higienis. Sertifikasi halal
                  sedang dalam proses pengajuan untuk memberikan jaminan lebih kepada konsumen.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-orange-200 rounded-lg px-6">
                <AccordionTrigger className="text-orange-900 font-semibold hover:text-orange-700">
                  Bagaimana cara penyimpanan Singkong Keju Mbah Wiryo?
                </AccordionTrigger>
                <AccordionContent className="text-orange-700">
                  Simpan produk di dalam freezer dengan suhu beku (-18°C) untuk menjaga kualitas terbaiknya hingga
                  berbulan-bulan. Pastikan kemasan tertutup rapat untuk mencegah freezer burn.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-orange-200 rounded-lg px-6">
                <AccordionTrigger className="text-orange-900 font-semibold hover:text-orange-700">
                  Apakah ada minimal pembelian untuk pengiriman?
                </AccordionTrigger>
                <AccordionContent className="text-orange-700">
                  Untuk pengiriman ke luar kota, ada minimal pembelian yang disesuaikan dengan area pengiriman. Silakan
                  hubungi kami untuk informasi lebih lanjut mengenai minimal order di wilayah Anda.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-orange-200 rounded-lg px-6">
                <AccordionTrigger className="text-orange-900 font-semibold hover:text-orange-700">
                  Wilayah pengiriman mana saja yang terjangkau?
                </AccordionTrigger>
                <AccordionContent className="text-orange-700">
                  Saat ini kami melayani pengiriman ke seluruh wilayah Pulau Jawa dengan gratis ongkir untuk pembelian
                  minimal tertentu. Untuk di luar Jawa, dapat didiskusikan sesuai ekspedisi dan kondisi pengiriman yang
                  memungkinkan.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-orange-200 rounded-lg px-6">
                <AccordionTrigger className="text-orange-900 font-semibold hover:text-orange-700">
                  Berapa lama daya tahan produk setelah digoreng?
                </AccordionTrigger>
                <AccordionContent className="text-orange-700">
                  Setelah digoreng, singkong keju sebaiknya dikonsumsi dalam 2-3 jam untuk mendapatkan tekstur terbaik.
                  Namun, jika disimpan dalam wadah tertutup, masih bisa bertahan hingga 1 hari di suhu ruang.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Kontak Section */}
      <section id="kontak" className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-orange-500 text-white mb-4">Hubungi Kami</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-900 mb-4">Hubungi Kami</h2>
            <p className="text-lg text-orange-700 max-w-2xl mx-auto">
              Punya pertanyaan, ingin memesan lebih banyak, atau berdiskusi kemitraan? Jangan ragu untuk menghubungi
              kami!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-orange-900">Email</h3>
                  <p className="text-orange-700">halo@singkongkejumbahwiryo.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-orange-900">WhatsApp</h3>
                  <p className="text-orange-700">{WHATSAPP_NUMBER}</p>
                  <Button
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`, "_blank")}
                  >
                    Klik untuk Chat Langsung
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-orange-900 mb-4">Belanja Online</h3>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    className="border-orange-500 text-orange-700 hover:bg-orange-50 bg-transparent"
                  >
                    🛒 Tokopedia
                  </Button>
                  <Button
                    variant="outline"
                    className="border-orange-500 text-orange-700 hover:bg-orange-50 bg-transparent"
                  >
                    🛍️ Shopee
                  </Button>
                </div>
              </div>
            </div>

            <Card className="bg-white shadow-2xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-orange-900 mb-6 text-center">
                  Dapatkan Info Terbaru & Promo Spesial!
                </h3>
                <p className="text-orange-700 text-center mb-6">Langsung ke kotak masuk Anda</p>
                <form className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Masukkan alamat email Anda"
                      className="border-orange-200 focus:border-orange-500"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white">
                    Langganan Sekarang!
                  </Button>
                </form>
                <p className="text-xs text-orange-600 text-center mt-4">
                  Dengan mendaftar, Anda menyetujui{" "}
                  <Link href="#" className="underline hover:text-orange-800">
                    Syarat & Ketentuan
                  </Link>{" "}
                  kami
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/images/mbah-wiryo-logo.png"
                  alt="Mbah Wiryo Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold">Mbah Wiryo</h3>
                  <p className="text-sm text-orange-300">Premium Cassava Cheese</p>
                </div>
              </div>
              <p className="text-orange-300 text-sm">
                Warisan cita rasa autentik dalam kemasan modern yang praktis untuk keluarga Indonesia.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-orange-300">
                <li>
                  <Link href="#" className="hover:text-white">
                    Singkong Keju Original
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Kroket Ragout Ayam
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Paket Hemat Keluarga
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Paket Reseller
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-orange-300">
                <li>
                  <Link href="#" className="hover:text-white">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Kemitraan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Karir
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-sm text-orange-300">
                <li>
                  <Link href="#" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Cara Pemesanan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-orange-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-orange-300 text-sm">
              Hak Cipta © 2025 Singkong Keju Frozen Mbah Wiryo. Semua Hak Dilindungi.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-orange-300 hover:text-white">
                <span className="sr-only">Facebook</span>📘
              </Link>
              <Link href="#" className="text-orange-300 hover:text-white">
                <span className="sr-only">Instagram</span>📷
              </Link>
              <Link href="#" className="text-orange-300 hover:text-white">
                <span className="sr-only">TikTok</span>🎵
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Order Form Modal */}
      <OrderForm isOpen={isOrderFormOpen} onClose={() => setIsOrderFormOpen(false)} />
    </div>
  )
}
