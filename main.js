const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/user/routes/authRoutes');
const productRoutes = require('./src/products/routes/productRoutes');
const supplierRouter = require('./src/supplier/routes/supplierRouter');
const warehouseRouter = require('./src/warehouse/routes/warehouseRouter');
const cartRouter = require('./src/cart/routes/cartRouter');
const billRouter = require('./src/bill/routes/billRouter');
const categoryRoutes = require('./src/products/routes/categoryRoutes');

const priceListRoutes = require('./src/priceList/router/priceRouter');
const promotionProgramRoutes = require("./src/promotion/router/promotionProgramRoutes");
const voucherRoutes = require("./src/promotion/router/voucherRoutes");

const stockRouter = require('./src/warehouse/routes/StockRouter');
const employeeRouter = require('./src/employee/routers/employeeRouter');
const transactionRoutes = require('./src/warehouse/routes/TransactionRoutes');
const customerRoutes = require('./src/customer/routers/customerRoutes');
const statisticsRouter = require('./src/bill/routes/statisticsRouter');
const vnpayRouter = require('./src/bill/routes/vnpayRouter');
const returnbillRouter = require('./src/bill/routes/billReturn');
dotenv.config();
const app = express();
const cron = require('node-cron');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// Cấu hình CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.1.7:8081', 'http://192.168.1.21:8081', 'https://fe-mart-shop-puce.vercel.app'],
  credentials: true
}));


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.use('/api/suppliers', supplierRouter);
app.use('/api/warehouses', warehouseRouter);
app.use('/api/cart', cartRouter)
app.use('/api/bill', billRouter)
app.use('/api/categories', categoryRoutes);

app.use('/api/price-list', priceListRoutes)
app.use("/api/promotion-program", promotionProgramRoutes);
app.use("/api/voucher", voucherRoutes);
app.use("/api/stock", stockRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/transactions", transactionRoutes);
app.use("/api/customers", customerRoutes);
app.use('/api/statistics', statisticsRouter)
app.use('/api/vnpay', vnpayRouter)
app.use('/api/return', returnbillRouter)
// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Kết nối MongoDB thành công');

    // Thiết lập cron job chạy mỗi phút
    cron.schedule('0 0 * * *', async () => {
      console.log('Chạy cron job thành công');
      await updatePricesCronJob();
    });
  })
  .catch((err) => console.log('Lỗi kết nối MongoDB:', err));
// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
