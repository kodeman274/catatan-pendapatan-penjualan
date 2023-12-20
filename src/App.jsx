import React, { useState, useEffect } from "react";

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
    const storedTotalIncome = parseFloat(localStorage.getItem("totalIncome")) || 0;
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
    setPrice(e.target.value);
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
      alert("Format inputnya salah. Harap masukkan harga dan menu dengan benar.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-800 relative">
      <div className="w-full max-w-2xl px-4 py-8 mx-auto bg-white rounded-lg shadow-xl">
        <div className="mb-6">
          <marquee className="">
            Jangan lupa selalu dicatat jika ada penjualan yang masuk
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
              value={price}
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
        </form>

        {sales.map((sale, index) => (
          <div key={index} className="mb-2">
            <h1 className="text-lg font-mono font-bold text-purple-900 leading-tight border-b-2 pb-2">
              {sale.price}k {sale.menu} - {sale.date}
            </h1>
            <button
              className="text-indigo-800"
              onClick={() => {
                // Implement edit logic here
                const updatedSale = prompt("Edit the sale:", `${sale.price}k ${sale.menu}`);
                if (updatedSale) {
                  // Update the sales array
                  setSales((prevSales) => {
                    const updatedSales = [...prevSales];
                    updatedSales[index] = { price: sale.price, menu: updatedSale, date: sale.date };
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
            Total pendapatan (nama-toko) = {totalIncome} k
          </h2>
        </div>
      </div>
    </div>
  );
}
