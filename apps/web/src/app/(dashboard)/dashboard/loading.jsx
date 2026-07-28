"use client";

import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";

export default function DashboardLoading() {
  return (
    <motion.div
      className="flex flex-col gap-6 pb-12 w-full max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header Area Skeleton */}
      <motion.div className="flex justify-between items-end mb-4 relative z-50" variants={itemVariants}>
        <div className="flex flex-col gap-2">
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-5 w-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </motion.div>

      {/* Main Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column (4 spans on lg) */}
        <motion.div className="lg:col-span-4 flex flex-col gap-4" variants={itemVariants}>
          {/* TotalBalanceCard Skeleton */}
          <div className="bg-white rounded-[40px] p-[30px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] min-h-[480px] w-full animate-pulse flex flex-col justify-between">
            <div className="flex justify-between items-center w-full mb-10">
              <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-64 bg-gray-200 rounded-xl"></div>
              <div className="h-6 w-32 bg-gray-200 rounded-full mt-2"></div>
            </div>
            <div className="w-full h-px bg-gray-200 my-10"></div>
            <div className="flex justify-between items-center w-full px-2 mb-8">
              <div className="h-14 w-32 bg-gray-200 rounded-xl"></div>
              <div className="h-14 w-32 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="h-12 w-full bg-gray-200 rounded-full"></div>
          </div>

          {/* CurrenciesMarket Skeleton (approx height) */}
          <div className="bg-white rounded-[32px] p-6 min-h-[300px] w-full animate-pulse border border-gray-100 flex flex-col gap-4">
             <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2"></div>
             <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
             <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
             <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
          </div>
          
          {/* TopSpending Skeleton */}
          <div className="bg-white rounded-[32px] p-6 min-h-[300px] w-full animate-pulse border border-gray-100 flex flex-col gap-4">
             <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2"></div>
             <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
             <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
             <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
          </div>
        </motion.div>

        {/* Middle and Right Columns Container (8 spans on lg) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Top Row of Middle/Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* KPI Grid (takes 2 spans) */}
            <motion.div className="lg:col-span-2 grid grid-cols-2 gap-x-6 gap-y-10" variants={itemVariants}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] min-h-[160px] animate-pulse flex flex-col items-center justify-center gap-4">
                   <div className="flex gap-3 mb-2">
                     <div className="w-11 h-11 bg-gray-200 rounded-full"></div>
                     <div className="h-6 w-24 bg-gray-200 rounded-lg mt-2"></div>
                   </div>
                   <div className="h-8 w-32 bg-gray-200 rounded-xl"></div>
                   <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </motion.div>
            
            {/* Action Cards (takes 1 span) */}
            <motion.div className="lg:col-span-1" variants={itemVariants}>
              <div className="bg-white rounded-[32px] p-6 border border-gray-100 min-h-[400px] w-full animate-pulse flex flex-col gap-4">
                <div className="h-8 w-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-20 w-full bg-gray-200 rounded-xl"></div>
                <div className="h-20 w-full bg-gray-200 rounded-xl"></div>
                <div className="h-20 w-full bg-gray-200 rounded-xl"></div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Row of Middle/Right */}
          <motion.div className="flex-1 min-h-[300px]" variants={itemVariants}>
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 min-h-[350px] w-full animate-pulse flex flex-col gap-6">
               <div className="flex justify-between items-center">
                 <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
                 <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
               </div>
               <div className="flex-1 w-full bg-gray-100 rounded-xl"></div>
            </div>
          </motion.div>
          
        </div>
        
      </div>
    </motion.div>
  );
}
