import styles from './ProductDescription.module.css';

export const ProductDescription = ({ description }: { description: string }) => {
  return <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />;
};
