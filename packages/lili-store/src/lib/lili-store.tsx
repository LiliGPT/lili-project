import styles from './lili-store.module.css';

/* eslint-disable-next-line */
export interface LiliStoreProps {}

export function LiliStore(props: LiliStoreProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to LiliStore!</h1>
    </div>
  );
}

export default LiliStore;
