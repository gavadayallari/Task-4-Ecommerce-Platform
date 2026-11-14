import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { contactAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const FAQS = [
  {
    q: 'What payment methods do you support across India?',
    a: 'We accept UPI (Google Pay, PhonePe, Paytm, BHIM), Cash on Delivery (COD) on eligible orders up to ₹25,000, all major RuPay, Visa, and Mastercard Credit/Debit cards, and Net Banking across 40+ Indian banks.'
  },
  {
    q: 'How are delivery charges and GST calculated?',
    a: 'Orders above ₹500 qualify for FREE standard delivery across India. For orders under ₹500, a nominal delivery fee of ₹49 applies. A 5% GST is calculated transparently at checkout and detailed on your tax invoice.'
  },
  {
    q: 'Can I track my delivery in real-time?',
    a: 'Yes, every order includes automated status tracking through Pending, Processing, Shipped, and Delivered stages with tracking reference codes visible in your "My Orders" tab.'
  },
  {
    q: 'How does the test mode payment gateway work?',
    a: 'During testing, payments run on our secure simulated payment sandbox. Selecting UPI, Card, or Net Banking will generate real transaction references (e.g. UPI-TXN-..., BANK-NB-...) and securely complete the order without deducting real money.'
  }
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Enquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactAPI.submit(formData);
      setSubmitted(true);
      showToast('Your message has been sent to ShopNova Support!', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Order Enquiry',
        message: ''
      });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit query. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
          Customer Care & Helpdesk
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How can we help you today?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Our customer support team is available 24/7 across India. Send us an inquiry or reach us via phone or email.
        </p>
      </div>

      {/* Main Grid: Form & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information & Indian HQ */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Contact Information
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Toll-Free Helpline</h4>
                  <p className="text-sm font-black text-blue-600 mt-0.5">1800-208-9898</p>
                  <p className="text-[11px] text-slate-400">Available 24x7 (Toll Free)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Email Support</h4>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">support@shopnova.in</p>
                  <p className="text-[11px] text-slate-400">Response within 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Indian Registered Office</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    ShopNova Marketplace India Pvt Ltd,<br />
                    Buildings Alyssa, Begonia & Clover, Embassy Tech Village,<br />
                    Outer Ring Road, Devarabeesanahalli Village,<br />
                    Bengaluru, 560103, Karnataka, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Operational Hours</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Monday to Sunday: 24 Hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl p-6 shadow-md space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
              <span>ShopNova Buyer Protection</span>
            </h4>
            <p className="text-xs text-blue-100 leading-relaxed">
              Every order on ShopNova is protected with 100% genuine product guarantee, secure UPI/Card payments, and easy 7-day hassle-free returns.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Send Us an Inquiry</h3>
            <p className="text-xs text-slate-500 mt-1">
              Have questions regarding an order, return, or merchant partnership? Let us know below.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center space-y-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-emerald-900">Inquiry Received</h4>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Thank you for reaching out. A ShopNova support representative will review your message and reply via email within 2 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-800 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-3 py-3 focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="Order Enquiry">Order Status / Delivery</option>
                    <option value="Payment Issue">Payment / UPI Transaction</option>
                    <option value="Returns & Refund">Returns & Refund</option>
                    <option value="Product Enquiry">Product Details & Specifications</option>
                    <option value="Seller Partnership">Become a Seller on ShopNova</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Message / Query *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your query in detail, including order ID if applicable..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <span>{submitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-500">Quick answers about orders, payments and deliveries across India</p>
        </div>

        <div className="divide-y divide-slate-100 max-w-3xl mx-auto">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-800 hover:text-blue-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <p className="text-xs text-slate-600 mt-2 leading-relaxed animate-in fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

