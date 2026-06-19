import React, { useState, useEffect } from "react";
import { categoryApi } from "../../api/categoryApi";
import CategoryGrid from "../../components/ui/CategoryGrid";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await categoryApi.getAllCategories();
        setCategories(Array.isArray(data) ? data : data?.data || []);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container-xl px-3 py-5">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
        <div>
          <span className="section-eyebrow">Categories</span>
          <h2 className="section-heading">Browse all categories</h2>
          <p className="section-sub">Explore the full category catalog in a clean and organized grid.</p>
        </div>
      </div>

      <CategoryGrid categories={categories} loading={loading} />
    </div>
  );
};

export default CategoriesPage;
