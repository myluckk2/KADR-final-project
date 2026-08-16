import React, { useCallback, useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiVideo, FiBook, FiShield } from "react-icons/fi";
import Container from "../../components/Container";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import AdminItemForm from "../../components/AdminItemForm";
import { cardService } from "../../services/cardService";
import { bookService } from "../../services/bookService";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../utils/getImageUrl";
import styles from "./index.module.scss";

const PAGE_SIZE = 8;

const TABS = [
  { key: "card", label: "Video / Kartlar", icon: FiVideo, service: cardService },
  { key: "book", label: "Kitablar", icon: FiBook, service: bookService },
];

function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("card");

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const currentTab = TABS.find((t) => t.key === activeTab);

  const loadItems = useCallback(
    async (targetPage = 1) => {
      setLoading(true);
      setError(null);
      try {
        const { data, meta } = await currentTab.service.getAll({ page: targetPage, limit: PAGE_SIZE });
        setItems(data);
        setPage(meta.page);
        setTotalPages(meta.totalPages);
        setTotal(meta.total);
      } catch (err) {
        setError("Məlumat yüklənərkən xəta baş verdi. Backend serveri işlək olduğundan əmin olun.");
      } finally {
        setLoading(false);
      }
    },
    [currentTab]
  );

  useEffect(() => {
    loadItems(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleAdd = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    const label = activeTab === "book" ? "kitabı" : "kartı";
    if (!window.confirm(`Bu ${label} silmək istədiyinizə əminsiniz?`)) return;
    try {
      await currentTab.service.remove(id);
      const nextPage = items.length === 1 && page > 1 ? page - 1 : page;
      loadItems(nextPage);
    } catch (err) {
      window.alert("Silinərkən xəta baş verdi.");
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Container className={styles.heroInner}>
          <span className={styles.heroBadge}>
            <FiShield /> Admin Panel
          </span>
          <h1 className={styles.heroTitle}>Xoş gəldin, {user?.username}</h1>
          <p className={styles.heroText}>
            Bu paneldən kataloqdakı video/kartları və kitabları əlavə et, redaktə et və ya sil.
          </p>

          <div className={styles.tabs}>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={[styles.tabBtn, activeTab === tab.key ? styles.tabActive : ""].join(" ")}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <Icon /> {tab.label}
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      <Container className={styles.content}>
        <div className={styles.contentHeader}>
          <div>
            <h2 className={styles.contentTitle}>{currentTab.label}</h2>
            <span className={styles.contentCount}>Ümumi: {total} element</span>
          </div>
          <Button variant="primary" size="sm" onClick={handleAdd}>
            <FiPlus /> Yeni əlavə et
          </Button>
        </div>

        {loading && <Loader label="Yüklənir..." />}

        {!loading && error && <EmptyState title="Bir xəta baş verdi" description={error} />}

        {!loading && !error && items.length === 0 && (
          <EmptyState
            title="Hələ heç bir element yoxdur"
            description="Yuxarıdakı düymədən ilk elementi əlavə et."
          />
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.thPicture}>Şəkil</th>
                    <th>Başlıq</th>
                    <th>{activeTab === "book" ? "Müəllif" : "Video linki"}</th>
                    {activeTab === "book" && <th>Qiymət</th>}
                    <th className={styles.thActions}>Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className={styles.thPicture}>
                        <img src={getImageUrl(item.picture)} alt={item.title} className={styles.rowPicture} />
                      </td>
                      <td>
                        <span className={styles.rowTitle}>{item.title}</span>
                        {item.description && (
                          <span className={styles.rowDescription}>{item.description}</span>
                        )}
                      </td>
                      <td>{activeTab === "book" ? item.author : item.video_url || "—"}</td>
                      {activeTab === "book" && <td>{Number(item.price).toFixed(2)} ₼</td>}
                      <td className={styles.tdActions}>
                        <div className={styles.actionsWrap}>
                          <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={() => handleEdit(item)}
                            aria-label="Redaktə et"
                            title="Redaktə et"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            type="button"
                            className={[styles.iconBtn, styles.iconBtnDanger].join(" ")}
                            onClick={() => handleDelete(item.id)}
                            aria-label="Sil"
                            title="Sil"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination page={page} totalPages={totalPages} onChange={loadItems} />
          </>
        )}
      </Container>

      {formOpen && (
        <AdminItemForm
          type={activeTab}
          item={editingItem}
          onClose={() => setFormOpen(false)}
          onCreated={() => loadItems(page)}
          onUpdated={() => loadItems(page)}
        />
      )}
    </div>
  );
}

export default AdminPage;
