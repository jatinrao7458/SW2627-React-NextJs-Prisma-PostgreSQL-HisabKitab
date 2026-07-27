import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import styles from "../analytics/TransactionModal.module.css";

export default function AdjustBalanceModal({ isOpen, onClose, onAdjustBalance, partyName }) {
  const [type, setType] = useState("GIVE"); // "GIVE" or "COLLECT"
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return;
    
    setIsSubmitting(true);
    await onAdjustBalance({ amount, type });
    setIsSubmitting(false);
    
    setAmount("");
    setType("GIVE");
  };

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className={styles.modal}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h2 className={styles.title}>Adjust Pending Balance for {partyName}</h2>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.typeSelector}>
              <button
                type="button"
                className={`${styles.typeBtn} ${type === "GIVE" ? styles.typeBtnGave : ""}`}
                onClick={() => setType("GIVE")}
              >
                <ArrowUpRight size={18} />
                You Gave (Owes you more)
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${type === "COLLECT" ? styles.typeBtnGot : ""}`}
                onClick={() => setType("COLLECT")}
              >
                <ArrowDownLeft size={18} />
                You Got (Owes you less)
              </button>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Amount</label>
              <div className={styles.amountInputWrapper}>
                <span className={styles.currencySymbol}>₹</span>
                <input
                  type="number"
                  className={styles.amountInput}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Balance"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
