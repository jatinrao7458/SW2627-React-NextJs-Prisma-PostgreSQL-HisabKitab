"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreVertical, Package, AlertTriangle, TrendingUp, RefreshCcw, Search, Calendar, X, Filter } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/animations";
import styles from "./Inventory.module.css";
import AddInventoryModal from "./AddInventoryModal";
import { createProduct, getProducts } from "@/actions/inventory";
import useSWR from "swr";

export default function InventoryView() {
  const { data: fetchedInventory, mutate } = useSWR(
    'inventory',
    () => getProducts()
  );

  const [inventory, setInventory] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [expiryDateFilter, setExpiryDateFilter] = useState("");

  useEffect(() => {
    if (fetchedInventory) {
      setInventory(fetchedInventory);
    }
  }, [fetchedInventory]);

  const filteredInventory = inventory.filter(product => {
    if (categoryFilter !== "ALL" && product.category !== categoryFilter) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (expiryDateFilter && product.expiryDate) {
      const pDate = new Date(product.expiryDate).toISOString().slice(0, 10);
      if (pDate !== expiryDateFilter) return false;
    } else if (expiryDateFilter && !product.expiryDate) {
      return false; // User wants a specific expiry date, but this product has none
    }
    return true;
  });

  const handleAddProduct = async (newProduct) => {
    // Optimistic UI update
    setInventory([newProduct, ...inventory]);
    
    // Server Action
    const result = await createProduct(newProduct);
    if (!result.success) {
      // Revert if failed (in a real app, show error toast)
      setInventory(inventory);
      console.error(result.error);
    }
  };

  return (
    <>
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ 
          filter: isAddModalOpen ? "blur(8px)" : "none", 
          transition: "filter 0.3s ease",
          pointerEvents: isAddModalOpen ? "none" : "auto"
        }}
      >
        {/* HEADER */}
      <motion.div className={styles.header} variants={itemVariants}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Inventory</h2>
          <p className={styles.subtitle}>Track products, stock levels, and pricing</p>
        </div>
        <motion.button
          className={styles.primaryBtn}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} />
          <span>Add Product</span>
        </motion.button>
      </motion.div>

      {/* FILTERS */}
      <motion.div className={styles.filtersContainer} variants={itemVariants}>
        <div className={styles.searchBar}>
          <Search size={16} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterDropdown}>
          <Filter size={16} className={styles.searchIcon} />
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.searchInput}
          >
            <option value="ALL">All Categories</option>
            <option value="Groceries">Groceries</option>
            <option value="Dairy">Dairy</option>
            <option value="Snacks">Snacks</option>
            <option value="Household">Household</option>
            <option value="Beverages">Beverages</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.dateFilter}>
          <Calendar size={16} className={styles.searchIcon} />
          <input 
            type="date"
            value={expiryDateFilter}
            onChange={(e) => setExpiryDateFilter(e.target.value)}
            className={styles.searchInput}
          />
          {expiryDateFilter && (
            <button onClick={() => setExpiryDateFilter("")} className={styles.clearDateBtn}>
              <X size={14} />
            </button>
          )}
        </div>
      </motion.div>

      {/* PRODUCT GRID */}
      <motion.section className={styles.grid} variants={containerVariants}>
        {filteredInventory.map((product) => {
          
          let statusColor = "#10B981"; // Healthy (Emerald)
          let StatusIcon = Package;
          let accentColor = "#10B981";

          if (product.status === "Low") {
            statusColor = "#F59E0B"; // Low (Amber)
            StatusIcon = TrendingUp;
            accentColor = "#F59E0B";
          } else if (product.status === "Out") {
            statusColor = "#EF4444"; // Out (Red)
            StatusIcon = AlertTriangle;
            accentColor = "#EF4444";
          }

          return (
            <motion.div
              key={product.id}
              className={styles.card}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className={styles.cardAccent} style={{ backgroundColor: accentColor }} />
              
              <div className={styles.cardHeader}>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productMeta}>
                    <span className={styles.metaBadge}>{product.sku || "No SKU"}</span>
                    <span>•</span>
                    <span>{product.category}</span>
                  </div>
                </div>
                <button className={styles.moreBtn} aria-label="More options">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className={styles.cardBody}>
                {/* Stock Indicator */}
                <div className={styles.stockContainer}>
                  <div className={styles.stockIcon} style={{ backgroundColor: `${statusColor}1A`, color: statusColor }}>
                    <StatusIcon size={20} />
                  </div>
                  <div className={styles.stockDetails}>
                    <span className={styles.stockLabel}>Current Stock</span>
                    <span className={styles.stockValue} style={{ color: statusColor }}>
                      {product.currentStock} {product.unit}
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className={styles.pricingGrid}>
                  <div className={styles.priceGroup}>
                    <span className={styles.priceLabel}>Selling Price</span>
                    <span className={styles.priceValue}>₹{product.sellingPrice}</span>
                  </div>
                  <div className={styles.priceGroup}>
                    <span className={styles.priceLabel}>Purchase Price</span>
                    <span className={styles.priceValue}>₹{product.purchasePrice}</span>
                  </div>
                </div>

                {/* Expiry Date */}
                {product.expiryDate && (
                  <div className={styles.pricingGrid} style={{ marginTop: '12px' }}>
                    <div className={styles.priceGroup} style={{ width: '100%' }}>
                      <span className={styles.priceLabel}>Expiry Date</span>
                      <span className={styles.priceValue} style={{ fontSize: '14px' }}>
                        {new Date(product.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.cardActions}>
                <button className={styles.actionBtn}>
                  <RefreshCcw size={16} />
                  Update Stock
                </button>
              </div>
            </motion.div>
          );
        })}
        {filteredInventory.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: '4rem 2rem', textAlign: 'center', color: 'rgba(26,26,26,0.5)', gridColumn: '1 / -1' }}
          >
            <Package size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <p>No products found for this filter.</p>
          </motion.div>
        )}
      </motion.section>
      </motion.div>

      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </>
  );
}
