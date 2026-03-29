import React, { useEffect, useState } from "react";
import {
  FiPlus, FiMinus, FiTrash2, FiSearch,
  FiCreditCard, FiCheck, FiSmartphone,
  FiDownload, FiMail
} from "react-icons/fi";
import { GiCash } from "react-icons/gi";
import { FaWhatsapp } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { langData, LangKey } from "../utils/lang";

type Props = {
  cart: any[];
  setCart: any;
  dark: boolean;
  lang: LangKey;
};

type Product = {
  id: number;
  name: { en: string; hi: string; mr: string };
  price: number;
  category: string;
  type: "weight" | "unit";
};

type CartItem = Product & {
  quantity: number;
  weight?: number;
};

export default function CheckoutPage({ cart, setCart, dark, lang }: Props) {
  const language = lang;
  const t = langData[lang];

  // const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cash">("card");
  const [upiId, setUpiId] = useState("");

  const products: Product[] = [
    { id: 1, name: { en: 'Rice', hi: 'चावल', mr: 'तांदूळ' }, price: 60, category: 'Grains', type: 'weight' },
    { id: 2, name: { en: 'Wheat Flour', hi: 'आटा', mr: 'गहू पीठ' }, price: 45, category: 'Grains', type: 'weight' },
    { id: 3, name: { en: 'Sugar', hi: 'चीनी', mr: 'साखर' }, price: 50, category: 'Essentials', type: 'weight' },
    { id: 4, name: { en: 'Milk', hi: 'दूध', mr: 'दूध' }, price: 55, category: 'Dairy', type: 'unit' },
    { id: 5, name: { en: 'Cooking Oil', hi: 'तेल', mr: 'तेल' }, price: 140, category: 'Essentials', type: 'unit' },
    { id: 6, name: { en: 'Toor Dal', hi: 'तूर दाल', mr: 'तूर डाळ' }, price: 120, category: 'Pulses', type: 'weight' },
    { id: 7, name: { en: 'Salt', hi: 'नमक', mr: 'मीठ' }, price: 25, category: 'Essentials', type: 'unit' },
    { id: 8, name: { en: 'Biscuits', hi: 'बिस्कुट', mr: 'बिस्किट' }, price: 20, category: 'Snacks', type: 'unit' },
    { id: 9, name: { en: 'Tea Powder', hi: 'चाय पत्ती', mr: 'चहा पावडर' }, price: 180, category: 'Beverages', type: 'weight' },
    { id: 10, name: { en: 'Coffee', hi: 'कॉफी', mr: 'कॉफी' }, price: 250, category: 'Beverages', type: 'weight' },
    { id: 11, name: { en: 'Turmeric Powder', hi: 'हल्दी', mr: 'हळद' }, price: 200, category: 'Spices', type: 'weight' },
    { id: 12, name: { en: 'Chilli Powder', hi: 'मिर्च पाउडर', mr: 'तिखट' }, price: 220, category: 'Spices', type: 'weight' },
    { id: 13, name: { en: 'Coriander Powder', hi: 'धनिया पाउडर', mr: 'धणे पावडर' }, price: 180, category: 'Spices', type: 'weight' },
    { id: 14, name: { en: 'Onion', hi: 'प्याज', mr: 'कांदा' }, price: 30, category: 'Vegetables', type: 'weight' },
    { id: 15, name: { en: 'Potato', hi: 'आलू', mr: 'बटाटा' }, price: 25, category: 'Vegetables', type: 'weight' },
    { id: 16, name: { en: 'Tomato', hi: 'टमाटर', mr: 'टोमॅटो' }, price: 40, category: 'Vegetables', type: 'weight' },
    { id: 17, name: { en: 'Paneer', hi: 'पनीर', mr: 'पनीर' }, price: 300, category: 'Dairy', type: 'unit' },
    { id: 18, name: { en: 'Butter', hi: 'मक्खन', mr: 'लोणी' }, price: 250, category: 'Dairy', type: 'unit' },
    { id: 19, name: { en: 'Curd', hi: 'दही', mr: 'दही' }, price: 60, category: 'Dairy', type: 'unit' },
    { id: 20, name: { en: 'Bread', hi: 'ब्रेड', mr: 'ब्रेड' }, price: 40, category: 'Bakery', type: 'unit' },
    { id: 21, name: { en: 'Eggs', hi: 'अंडे', mr: 'अंडी' }, price: 6, category: 'Dairy', type: 'unit' },
    { id: 22, name: { en: 'Soap', hi: 'साबुन', mr: 'साबण' }, price: 30, category: 'Household', type: 'unit' },
    { id: 23, name: { en: 'Shampoo', hi: 'शैम्पू', mr: 'शॅम्पू' }, price: 120, category: 'Household', type: 'unit' },
    { id: 24, name: { en: 'Toothpaste', hi: 'टूथपेस्ट', mr: 'टूथपेस्ट' }, price: 90, category: 'Household', type: 'unit' },
    { id: 25, name: { en: 'Maggi Noodles', hi: 'मैगी', mr: 'मॅगी' }, price: 15, category: 'Snacks', type: 'unit' },
  ];

  const weightOptions = [
    { value: 0.25, label: { en: "250 gm", hi: "250 ग्राम", mr: "250 ग्रॅम" } },
    { value: 0.5, label: { en: "500 gm", hi: "500 ग्राम", mr: "500 ग्रॅम" } },
    { value: 0.75, label: { en: '750 gm', hi: '750 ग्राम', mr: '750 ग्रॅम' } },
    { value: 1, label: { en: "1 kg", hi: "1 किलो", mr: "1 किलो" } },
  ];

  useEffect(() => {
    let barcode = "";

    const handleKey = (e: any) => {
      if (e.key === "Enter") {
        const found = products.find(p => p.id.toString() === barcode);
        if (found) addToCart(found);
        barcode = "";
      } else {
        barcode += e.key;
      }
    };

    window.addEventListener("keypress", handleKey);
    return () => window.removeEventListener("keypress", handleKey);
  }, [cart]);

  // ⌨️ SHORTCUTS
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.key === "F1") toast("Scan product");
      if (e.key === "F2") setCart([]);
      if (e.key === "F3") handleCheckout();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [cart]);

  const shareWhatsApp = () => {
    let message = `🧾 Grocery Bill\n\n`;

    cart.forEach((item) => {
      message += `${item.name[language]} x${item.quantity} = ₹${item.price * item.quantity}\n`;
    });

    message += `\nTotal: ₹${total.toFixed(2)}`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareEmail = () => {
    let subject = 'Grocery Bill';
    let body = 'Bill Details:\n\n';

    cart.forEach((item) => {
      body += `${item.name[language]} x${item.quantity} = ₹${item.price * item.quantity}\n`;
    });

    body += `\nTotal: ₹${total.toFixed(2)}`;

    window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  const generatePDF = () => {
    // const doc = new jsPDF();

    // doc.text('Grocery Bill', 20, 20);

    // let y = 40;

    // cart.forEach((item) => {
    //   doc.text(
    //     `${item.name[language ]} x${item.quantity} - ₹${item.price * item.quantity}`,
    //     20,
    //     y
    //   );
    //   y += 10;
    // });

    // doc.text(`Total: ₹${total.toFixed(2)}`, 20, y + 10);

    // doc.save('bill.pdf');
  };

  // 🔥 ADD TO CART (SAME LOGIC)
  const addToCart = (product: Product, weight = 1) => {
    const isWeight = product.type === "weight";

    const existing = cart.find(
      (i) => i.id === product.id && (isWeight ? i.weight === weight : true)
    );

    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === product.id && (isWeight ? i.weight === weight : true)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
          weight: isWeight ? weight : 1,
        },
      ]);
    }

    // toast.success(`${product.name[t]} added`);
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(cart.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      item.price *
      (item.type === "weight" ? item.weight! : 1) *
      item.quantity,
    0
  );

  const tax = subtotal * 0.18;
  const total = subtotal + tax;
  const change = amountPaid - total;

  // 🔥 STOCK DEDUCTION
  const handleCheckout = async () => {

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    if (paymentMethod !== 'upi' && amountPaid < total) {
      toast.error('Insufficient payment');
      return;
    }

    let paymentText = '';
    if (paymentMethod === 'upi') {
      // handleRazorpay()
      paymentText = `UPI Payment Processed (${upiId})`;
    } else if (paymentMethod === 'cash') {
      paymentText = `Cash Payment Processed! Change: ₹${change.toFixed(2)}`;
    } else {
      paymentText = `Card Payment Processed! Change: ₹${change.toFixed(2)}`;
    }


    await window.api.createSale({
      items: cart,
      total,
    });

    toast.success(paymentText || "Payment successful!");
    setCart([]);
    setAmountPaid(0);
    setUpiId('');
  };

  // const filtered = products.filter((p) =>
  //   p.name.en.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filtered = products.filter((p) =>
    p.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.hi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.mr.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className={`${dark ? "bg-gray-900 text-white" : "bg-gray-100"} p-4 min-h-screen`}>
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* PRODUCTS */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{t.checkout}</h1>
          {/* Search Bar */}
          <div className="mb-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={"w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 " + (dark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-300")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white border border-gray-700 p-4 rounded-xl shadow hover:scale-105 transition">

                <p className="font-semibold text-sm">{p.name[language]}</p>
                <p className="text-xs text-gray-500 mb-1">
                  {p.category}
                </p>
                <p className="text-lg font-bold text-blue-600">
                  ₹{p.price}
                  <span className="text-xs text-gray-400 ml-1">
                    {p.type === 'weight' ? '/kg' : ''}
                  </span>
                </p>

                {p.type === "weight" ? (
                  <select
                    onChange={(e) => {
                      addToCart(p, Number(e.target.value));
                      e.target.value = '';
                    }}
                    className=" focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 w-full p-2 text-sm rounded-xl border transition bg-gray-700 text-white border-gray-600 border-gray-700 hover:border-gray-700"
                    defaultValue="">
                    <option value="" disabled>
                      {language === 'en'
                        ? 'Select weight'
                        : language === 'hi'
                          ? 'वजन चुनें'
                          : 'वजन निवडा'}
                    </option>
                    {weightOptions.map((w) => (
                      <option key={w.value} value={w.value}>
                        {w.label[language]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="flex-1 bg-blue-600 text-white py-1 rounded-lg text-sm hover:bg-blue-700"
                    >
                      {language === 'en'
                        ? 'Add'
                        : language === 'hi'
                          ? 'जोड़ें'
                          : 'जोडा'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CART */}
        <div className="sticky top-8 h-fit rounded-lg border p-6 shadow-lg bg-gray-800 text-white border-gray-700">
          <h2 className="text-xl font-bold mb-4"> {t.orderSummary}</h2>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2 mb-3 justify-center items-center">
            <button onClick={generatePDF} className="p-2 bg-green-600 text-white rounded-lg flex items-center justify-center hover:scale-105 transition">
              <FiDownload size={22} />
            </button>
            <button onClick={shareWhatsApp} className="p-2 bg-green-500 text-white rounded-lg flex items-center justify-center hover:scale-105 transition">
              <FaWhatsapp size={22} />
            </button>
            <button onClick={shareEmail} className="p-2 bg-gray-600 text-white rounded-lg flex items-center justify-center hover:scale-105 transition">
              <FiMail size={22} />
            </button>
          </div>

          <div className="mb-4 max-h-48 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t.cartEmpty}</p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className={`flex items-center justify-between ${dark ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg`}>

                    <div className="flex-1">
                      <p>{item.name[language]} {item.type === 'weight' && ` (${item.weight}kg)`}</p>
                      <p className="text-xs text-gray-500">₹{item.price} each</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-700 rounded transition"
                      >
                        <FiMinus className="text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-700 rounded transition"
                      >
                        <FiPlus className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`border-t border-gray-700 pt-4 mb-4 space-y-2`}>
            <div className="flex justify-between text-sm">
              <span>{t.subtotal}:</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t.gst} (5%):</span>
              <span className="font-semibold">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>{t.total}:</span>
              <span className="text-blue-600">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* PAYMENT */}
            <div className="mb-4">
            <p className="text-sm font-semibold mb-3">{t.payment}:</p>
            <div className="space-y-2">
              {/* Card Payment */}
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-3 rounded-lg border-2 transition flex items-center gap-2 ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-100 text-blue-700'
                    : `bg-gray-800 border-gray-700 text-white hover:border-gray-700`
                }`}
              >
                <FiCreditCard className="text-lg"/>
                <span className="flex-1 text-left font-medium">{t.card}</span>
                {paymentMethod === 'card' && <FiCheck className="text-blue-600 text-lg" />}
              </button>

              {/* UPI Payment */}
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`w-full p-3 rounded-lg border-2 transition flex items-center gap-2 ${
                  paymentMethod === 'upi'
                    ? 'border-green-600 bg-green-100 text-green-700'
                    : `bg-gray-800 border-gray-700 text-white hover:border-gray-700`
                }`}
              >
                <FiSmartphone className="text-lg"/>
                <span className="flex-1 text-left font-medium">{t.upi}</span>
                {paymentMethod === 'upi' && <FiCheck className="text-green-600 text-lg" />}
              </button>
            

              {/* Cash Payment */}
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`w-full p-3 rounded-lg border-2 transition flex items-center gap-2 ${
                  paymentMethod === 'cash'
                    ? 'border-orange-600 bg-orange-100 text-orange-700'
                    : `bg-gray-800 border-gray-700 text-white hover:border-gray-700`
                }`}
              >
                <GiCash className="text-lg"/>
                <span className="flex-1 text-left font-medium">{t.cash}</span>
                {paymentMethod === 'cash' && <FiCheck className="text-orange-600 text-lg" />}
              </button>
            </div>
          </div>

           {paymentMethod === 'upi' && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., user@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white border-gray-600`}
              />
            </div>
          )}

           {paymentMethod !== 'upi' && (
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Amount Paid (₹):</label>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white border-gray-600`}
                placeholder="0.00"
              />
            </div>
          )}

          {paymentMethod !== 'upi' && amountPaid >= total && (
            <div className="mb-4 p-3 bg-green-100 rounded-lg">
              <p className="text-sm text-gray-600">Change</p>
              <p className="text-2xl font-bold text-green-600">₹{change.toFixed(2)}</p>
            </div>
          )}


          <button
            onClick={handleCheckout}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            {t.process}
          </button>
        </div>
      </div>
    </div>
  );
}