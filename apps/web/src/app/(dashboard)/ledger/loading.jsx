import styles from "./Ledger.module.css";

export default function LedgerLoading() {
  return (
    <div className={styles.container}>
      {/* HEADER SKELETON */}
      <div className={styles.header}>
        <div>
          <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-5 w-80 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="h-12 w-36 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>

      {/* SUMMARY CARDS SKELETON */}
      <section className={styles.summaryGrid}>
        {[...Array(2)].map((_, i) => (
          <div 
            key={i}
            className={`${styles.summaryCard} animate-pulse`} 
          >
            <div className={styles.summaryAccent} style={{ backgroundColor: "#e5e7eb" }} />
            <div className={`${styles.summaryIcon} bg-gray-200`}></div>
            <div className={styles.summaryContent}>
              <div className="h-4 w-28 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-8 w-40 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </section>

      {/* TABS SKELETON */}
      <div className={styles.tabs}>
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* LIST SKELETON */}
      <section className={styles.ledgerList}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`${styles.row} animate-pulse`}
          >
            <div className={styles.contactGroup}>
              <div className={`${styles.avatar} bg-gray-200 text-transparent`}>?</div>
              <div className={styles.contactDetails}>
                <div className="h-6 w-32 bg-gray-200 rounded-md mb-1"></div>
                <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
              </div>
            </div>
            
            <div className={styles.amountGroup}>
              <div className="h-6 w-24 bg-gray-200 rounded-md mb-1"></div>
              <div className="h-4 w-16 bg-gray-200 rounded-md self-end"></div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
