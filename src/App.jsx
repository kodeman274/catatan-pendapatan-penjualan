import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const STORAGE_KEY = "ayamTaliwangSales";

export default function App() {
  const [sales, setSales] = useState(() => {
    const storedSales = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (storedSales) {
      return storedSales;
    }
    return [];
  });

  const [totalIncome, setTotalIncome] = useState(() => {
    const storedTotalIncome =
      parseFloat(localStorage.getItem("totalIncome")) || 0;
    return storedTotalIncome;
  });

  const [price, setPrice] = useState("");
  const [menu, setMenu] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem("totalIncome", totalIncome.toString());
  }, [totalIncome]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    // Menghapus karakter selain angka, koma, dan titik
    const cleanedValue = rawValue.replace(/[^\d.,]/g, "");

    // Menguji apakah nilai setelah dibersihkan adalah angka yang valid
    if (!isNaN(cleanedValue)) {
      setPrice(cleanedValue);
    } else {
      // Jika input tidak valid, Anda dapat memberikan umpan balik kepada pengguna atau mengabaikannya
      alert("Format harga tidak valid.");
    }
  };

  const handleMenuChange = (e) => {
    setMenu(e.target.value);
  };

  const handleAddSale = () => {
    if (!isNaN(price) && menu) {
      const sale = {
        price: parseFloat(price),
        menu,
        date,
      };

      setSales((prevSales) => [sale, ...prevSales]);
      setTotalIncome((prevIncome) => prevIncome + parseFloat(price));

      setPrice("");
      setMenu("");
      setDate("");
    } else {
      alert(
        "Format inputnya salah. Harap masukkan harga dan menu dengan benar."
      );
    }
  };

  const handleRemoveSale = (index) => {
    const confirmRemove = window.confirm(
      "Apakah Anda yakin ingin menghapus penjualan ini?"
    );
    if (confirmRemove) {
      const removedSale = sales[index];
      setSales((prevSales) => prevSales.filter((_, i) => i !== index));
      setTotalIncome((prevIncome) => prevIncome - removedSale.price);
    }
  };

  const handleRemoveAllData = () => {
    const confirmRemoveAll = window.confirm(
      "apakah ada yakin mengahapus semua data ini"
    );
    if (confirmRemoveAll) {
      // Menghapus semua data penjualan
      setSales([]);
      // Menghapus data dari local storage
      setTotalIncome(0);

      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("totalIncome");
    }
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Catatan Penjualan [nama-toko]", 10, 10);

    // Tambahkan header tabel
    const headers = ["Harga", "Nama Menu/Barang", "Tanggal"];
    const data = sales.map((sale) => [`${sale.price}k`, sale.menu, sale.date]);

    // Tambahkan tabel ke PDF
    doc.autoTable({
      startY: 20,
      head: [headers],
      body: data,
    });

    // Tambahkan total pendapatan di akhir laporan
    doc.text(
      "Total Pendapatan: Rp. " + totalIncome.toString() + "k",
      10,
      doc.autoTable.previous.finalY + 10
    );

    // Simpan PDF
    doc.save("laporan-penjualan.pdf");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-800 relative">
      <div className="w-full max-w-2xl px-4 py-8 mx-auto bg-white rounded-lg shadow-xl">
        <div className="mb-6">
          <marquee className="">
            Jangan lupa selalu dicatat jika ada cash flow
          </marquee>
          <h2 className="text-2xl font-bold text-center text-teal-800">
            Catatan Penjualan (nama-toko)
          </h2>
          <p className="text-center text-teal-800">
            Total harga & nama menu/barang
          </p>
        </div>

        <form action="#" className="mb-6">
          <div className="mb-4 flex items-center">
            <input
              className="w-1/2 p-2 mr-2 rounded-md border-none bg-indigo-800 text-white placeholder-slate-200 shadow-lg outline-none"
              type="text"
              name="price"
              value={price.toLocaleString("id-ID")}
              onChange={handlePriceChange}
              placeholder="Harga"
            />
            <input
              className="w-1/2 p-2 ml-2 rounded-md border-none bg-indigo-800 text-white placeholder-slate-200 shadow-lg outline-none"
              type="text"
              name="menu"
              value={menu}
              onChange={handleMenuChange}
              placeholder="Nama Menu/Barang"
            />
            <input
              className="w-1/2 p-2 ml-2 rounded-md border-none bg-indigo-800 text-white placeholder-slate-200 shadow-lg outline-none"
              type="text"
              name="date"
              value={date}
              onChange={handleDateChange}
              placeholder="Tanggal (YYYY-MM-DD)"
            />
          </div>
          <button
            type="button"
            onClick={handleAddSale}
            className="w-full bg-indigo-800 text-white p-2 rounded-md"
          >
            Kirim
          </button>
          <button
            type="button"
            onClick={handleExportToPDF}
            className="w-full bg-indigo-800 text-white p-2 rounded-md mt-4"
          >
            Export ke PDF
          </button>
          <button
            type="button"
            onClick={handleRemoveAllData}
            className="w-full bg-indigo-800 text-white p-2 rounded-md mt-4"
          >
            Menghapus Semua Data Catatan
          </button>
        </form>

        {sales.map((sale, index) => (
          <div key={index} className="mb-2">
            <h1 className="text-lg font-mono font-bold text-purple-900 leading-tight border-b-2 pb-2">
              {sale.price.toLocaleString("id-ID")} {sale.menu} - {sale.date}
            </h1>
            <button
              className="text-indigo-800 mr-2"
              onClick={() => {
                // Implement remove logic here
                handleRemoveSale(index);
              }}
            >
              Hapus
            </button>
            <button
              className="text-indigo-800"
              onClick={() => {
                // Implement edit logic here
                const updatedSale = prompt(
                  "Edit the sale name:",
                  `${sale.menu}`
                );
                if (updatedSale) {
                  // Update the sales array
                  setSales((prevSales) => {
                    const updatedSales = [...prevSales];
                    updatedSales[index] = {
                      price: sale.price,
                      menu: updatedSale,
                      date: sale.date,
                    };
                    return updatedSales;
                  });
                }
              }}
            >
              Edit
            </button>
          </div>
        ))}

        <div className="pt-4">
          <h2 className="text-lg font-bold text-teal-800 text-center">
            Total pendapatan (nama-toko) = Rp.{" "}
            {totalIncome.toLocaleString("id-ID")}
          </h2>
        </div>
      </div>
    </div>
  );
}
