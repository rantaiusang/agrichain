const express = require('express');
const cors = require('cors');

const app = express();

// 1. 导入路由
const authRouter = require('./backend/router');

// 2. 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Supabase 初始化
const { createClient } = require('@supabase/supabase-js');

// 从环境变量获取 Key (优先 Vercel 环境变量，无则使用硬编码作为本地调试)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nkcctncsjmcfsiguowms.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_CY2GLPbRJRDcRAyPXzOD4Q_63uR5W9X";

// 初始化客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// 注入 Supabase 实例
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

// 4. API 路由
// 获取配置的专用接口
app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: supabaseUrl,
        supabaseKey: supabaseKey
    });
});

// 认证路由
app.use('/api', authRouter);

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend AgriChain Running' });
});

// 5. 导出
module.exports = app;

// 6. Vercel Handler (Serverless 入口)
export default async function handler(req, res) {
    console.log(`[Vercel Handler] ${req.method} ${req.url}`);
    return app(req, res);
}
