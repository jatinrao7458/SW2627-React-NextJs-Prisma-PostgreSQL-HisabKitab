"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import styles from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <motion.div
        className={styles.spinnerWrapper}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Loader2 className={styles.spinner} size={48} />
        <h3 className={styles.loadingText}>Fetching Data...</h3>
      </motion.div>
    </div>
  );
}
