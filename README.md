MegaCityCab System
Overview
The MegaCityCab system is a vehicle reservation service that enables customers to book rides, view booking details, and make payments. Drivers can view upcoming trips and mark them as completed. The system is designed to provide a seamless experience for both customers and drivers while maintaining high performance and scalability.

Technologies Used
Frontend: Angular
Backend: Java EE
Database: MySQL
Version Control: Git/GitHub
CI/CD: GitHub Actions for Continuous Integration and Deployment
Key Features
Customer Registration: Customers can register and manage their profiles.
Booking Management: Customers can create bookings, choose cars, and view booking details.
Payment Integration: Payments are processed and stored in the database.
Driver Management: Drivers can view and manage their trips, including marking trips as completed.
Admin Management: Admins can view reports, manage users (customers, drivers), and manage cars.
System Design
The system follows a 3-tier architecture:

Frontend Layer (Angular): Handles user interactions and communicates with the backend.
Business Logic Layer (Java EE): Manages the core business logic of booking creation, payments, etc.
Data Layer (MySQL): Stores user data, bookings, payments, and driver information.
Design Patterns Used
Singleton Pattern: Used for managing the database connection.
Factory Pattern: Used for dynamically creating car objects based on customer selection.
Observer Pattern: Used for notifying customers and drivers about booking status updates.
Strategy Pattern: Used for dynamic pricing based on different strategies (e.g., distance, time).
Getting Started
Prerequisites
Ensure you have the following tools installed:

Node.js (for Angular)
Java 8+ (for Java EE)
MySQL
Git
