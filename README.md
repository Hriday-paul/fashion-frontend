# Fashi-ON – Fashion Marketplace

**Live Website:** [https://fashi-on.com](https://fashi-on.com)

Fashi-ON is a modern, feature-rich fashion marketplace designed to connect buyers, individual sellers, professional vendors, charities, and fashion enthusiasts through a unified platform. It provides a seamless environment for buying, selling, discovering, and exchanging pre-loved and new fashion items while promoting sustainable fashion and charitable contributions.

The platform combines a marketplace experience with real-time communication, flexible pricing, secure transactions, seller management, and buyer protection.

## Overview

Fashi-ON aims to make fashion more accessible, sustainable, and community-driven by enabling users to buy and sell fashion products through an intuitive digital marketplace.

The platform supports multiple seller categories, personalized storefronts, product discovery, direct buyer-seller communication, offer negotiations, order management, and charity-focused shopping experiences.

## Key Features

### 🛍️ Marketplace & Product Management
- Browse and discover fashion products across multiple categories.
- Advanced product filtering, searching, and sorting.
- Detailed product pages with images, pricing, descriptions, and seller information.
- Product listing and management for different seller categories.
- Support for new and pre-loved fashion items.
- Personalized seller storefronts and product collections.

### 👥 Multi-Type Seller Management
Fashi-ON supports different seller categories with dedicated marketplace experiences:

- **Individual Sellers** – Buy and sell personal fashion items.
- **Professional Sellers** – Businesses and professional fashion vendors.
- **Ambassadors** – Dedicated seller category for brand ambassadors.
- **Celebrities** – Celebrity-focused seller profiles and collections.
- **Assisted Sellers** – Sellers supported by Fashi-ON with photography, listing, storage, and sales management.
- **Eco-Friendly Stores** – Businesses focused on sustainable fashion.
- **Charity Shops** – Organizations selling products to support charitable causes.

### 💬 Real-Time Messaging & Communication
- Real-time buyer-to-seller messaging.
- Socket.IO-based communication.
- Dedicated conversations between marketplace users.
- Product-related conversations.
- Integrated offer negotiations within chat conversations.
- Message history and conversation management.
- Chat list with user-based search.

### 🤝 Offer & Negotiation System
- Buyers can make offers on products.
- Sellers can send offers to potential buyers.
- Support for different offer types, including target amount, discussion-based, and market-price offers.
- Offer acceptance, rejection, and expiration management.
- Integrated offer notifications.
- Negotiations managed directly within conversations.

### 📦 Order & Return Management
- Complete order lifecycle management.
- Order tracking and status management.
- Flexible return policies based on seller categories.
- Configurable voluntary return periods for eligible private sellers.
- Statutory cancellation and return policy support for eligible UK business transactions.
- Partial return support.
- Return periods calculated based on delivery dates.

### 💳 Payment & Financial Management
- Secure payment processing with Stripe.
- Stripe Connect integration for marketplace payments.
- Seller wallet management.
- Automatic commission calculation.
- Seller earnings management.
- Platform service fees and buyer protection fees.
- Currency conversion and multi-currency pricing support.
- Transaction and payment status management.

### ❤️ Charity & Sustainable Fashion
- Dedicated charity organization and charity shop profiles.
- Charity-supported product listings.
- Donation tracking and management.
- Financial contributions from eligible product sales.
- Charity impact statistics and supported-product tracking.
- Promotion of sustainable and circular fashion.

### 🔔 Notification System
- Real-time user notifications.
- Order and payment notifications.
- New message notifications.
- Offer-related notifications.
- Important marketplace activity updates.

### 🌍 International Marketplace Support
- Multi-currency support.
- International buyer experience.
- UK-based seller marketplace.
- International shipping integration through Easyship.
- Shipping and delivery management.

### 🔐 Authentication & User Management
- Secure user authentication.
- Role-based access and permissions.
- User profile management.
- Seller verification and document submission.
- Role-specific onboarding and validation.
- Account status and approval management.

## ⚡ Performance & Background Processing
- Redis integration for in-memory data storage and caching.
- BullMQ for background job processing and queue management.
- Asynchronous email processing.
- Automated retry mechanisms for failed background jobs.
- Improved application responsiveness through asynchronous task execution.
- Redis-backed job queues for reliable background processing.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Next.js, TypeScript |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Real-Time Communication | Socket.IO |
| State Management | Redux Toolkit |
| API Management | RTK Query |
| Styling | Tailwind CSS, Shadcn UI |
| Authentication | Cookie-based authentication |
| Payment Integration | Stripe, Stripe Connect |
| Shipping Integration | Easyship |
| Caching & In-Memory Storage | Redis |
| Background Jobs | BullMQ, Redis |
| Email Services | SMTP |
| Containerization | Docker |
| Deployment | Nginx, PM2 |

## Project Highlights

- Full-stack marketplace architecture with a separate frontend and backend.
- Scalable REST API architecture.
- Real-time communication using WebSockets.
- Redis-backed background job processing.
- Role-based marketplace functionality.
- Integrated payment and seller payout workflows.
- Flexible pricing and negotiation mechanisms.
- Multi-currency marketplace infrastructure.
- Third-party integrations for payments and international shipping.
- Sustainable fashion and charity-focused features.
- Business-specific return and cancellation policies.

---

**Fashi-ON** – Making fashion circular, accessible, and sustainable through technology.