"use client";

import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import styles from "./Inventory.module.css";

export default function InventoryLoading() {
  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* HEADER SKELETON */}
      <motion.div className={styles.header} variants={itemVariants}>
        <div className={styles.headerText}>
          <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-5 w-72 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-12 w-40 bg-gray-200 rounded-xl animate-pulse"></div>
      </motion.div>

      {/* FILTERS SKELETON */}
      <motion.div className={styles.filtersContainer} variants={itemVariants}>
        <div className="flex-[2] h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
      </motion.div>

      {/* PRODUCT GRID SKELETON */}
      <motion.section className={styles.grid} variants={containerVariants}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`${styles.card} animate-pulse`}
            variants={itemVariants}
          >
            <div className={styles.cardAccent} style={{ backgroundColor: "#e5e7eb" }} />
            
            <div className={styles.cardHeader}>
              <div className={styles.productInfo}>
                <div className="h-6 w-40 bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>

            <div className={styles.cardBody}>
              {/* Stock Indicator */}
              <div className={styles.stockContainer}>
                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                <div className={styles.stockDetails}>
                  <div className="h-4 w-20 bg-gray-200 rounded-md mb-1"></div>
                  <div className="h-5 w-24 bg-gray-200 rounded-md"></div>
                </div>
              </div>

              {/* Pricing */}
              <div className={styles.pricingGrid}>
                <div className={styles.priceGroup}>
                  <div className="h-4 w-20 bg-gray-200 rounded-md mb-1"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
                </div>
                <div className={styles.priceGroup}>
                  <div className="h-4 w-24 bg-gray-200 rounded-md mb-1"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
                </div>
              </div>
            </div>

            <div className={styles.cardActions}>
              <div className="h-10 w-full bg-gray-200 rounded-xl"></div>
            </div>
          </motion.div>
        ))}
      </motion.section>
    </motion.div>
  );
}
