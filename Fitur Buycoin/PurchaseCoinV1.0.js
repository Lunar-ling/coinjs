function hidepopupOrder() {
  document.getElementById("popup_detailsPesanan").style.display = "none";
}
function generateUniqueIdx(_0x648e43) {
  let _0x1d05ad = generateRandomStringx(_0x648e43.JumlahHuruf);
  let _0x34a85f = generateRandomNumberx(_0x648e43.JumlahNumber);
  return _0x648e43.NameUnik + "-" + _0x1d05ad + _0x34a85f;
}
function generateRandomStringx(_0x52cfab) {
  let _0x3cf1a5 = "";
  let _0x20970c = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".length;
  for (let _0x553b8b = 0; _0x553b8b < _0x52cfab; _0x553b8b++) {
    _0x3cf1a5 += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * _0x20970c));
  }
  return _0x3cf1a5;
}
function generateRandomNumberx(_0x1a93d3) {
  let _0x226ba1 = "";
  for (let _0x882af3 = 0; _0x882af3 < _0x1a93d3; _0x882af3++) {
    _0x226ba1 += Math.floor(10 * Math.random());
  }
  return _0x226ba1;
}
function checkInputAndSubmit() {
  var _0x399746 = document.getElementById("buktiTransfer");
  if (!document.getElementById("kebijakan").checked) {
    showSwalCoin("errorCentangkejibakan");
    return;
  }
  if (0 === _0x399746.files.length) {
    showSwalCoin("errorBuktipembayaran");
    return;
  }
  submitPembelian();
}
function tampilkanRiwayatPembelian(_0xb977e1) {
  var _0x5097ca = document.getElementById("riwayatPembelian");
  _0x5097ca.innerHTML = "";
  if (_0x5097ca) {
    db.collection("pembelian_User").doc(_0xb977e1).get().then(function (_0x25a96a) {
      if (_0x25a96a.exists) {
        var _0x141211 = _0x25a96a.data();
        Object.keys(_0x141211).forEach(function (_0x298e45) {
          var _0x341f5a = _0x141211[_0x298e45];
          var _0x500507 = document.createElement("div");
          var _0x590469 = isRupiah ? _0x341f5a.harga.toLocaleString("id-ID", {
            style: "currency",
            currency: "Ph Bill",
            minimumFractionDigits: 0
          }) : _0x341f5a.harga.toLocaleString("en-US", {
            style: "currency",
            currency: "Kyats",
            minimumFractionDigits: 0
          });
          _0x500507.innerHTML = "\n  <div class=\"listOrdercoin_users\">\n  <span class=\"orderIdCoin\"><b>Order ID:</b> <p>" + _0x298e45 + "</p></span>\n  <span class=\"itemOrderCoin\">                      \n<b>Item:</b> <p>" + _0x341f5a.jumlahCoin + " Coin</p>\n</span>\n  <span class=\"priceItemCoin\">                      \n<b>Price:</b> <p>" + _0x590469 + "</p>\n</span>\n                        \n<span class=\"dateOrder\">\n<b>Date:</b><p> " + _0x341f5a.tanggal.toDate().toLocaleString() + "</p>\n </span>                       \n<span class=\"statusOrder\">\n<b>Status:</b><p> " + (_0x341f5a.dikonfirmasi ? "success" : "Pending (Orders need Admin approval)") + "</p>\n</span>\n<hr>\n  </div>\n                    ";
          _0x5097ca.appendChild(_0x500507);
        });
      } else {
        document.querySelector(".belumRiwayatpembelian").innerHTML = riwayatPembelian_belumada;
        console.log("pembelian tidak ditemukan untuk pengguna dengan ID:", _0xb977e1);
      }
    }).catch(function (_0x8e045e) {
      console.error("Error saat mengambil riwayat pembelian: ", _0x8e045e);
    });
  } else {
    console.log(" id riwayatPembelian kosong");
  }
}
function getHarga(_0x14632a) {
  var _0xca214b = (isRupiah ? coinConfigRupiah : coinConfigUSD).find(function (_0x17af51) {
    return _0x17af51.amount == _0x14632a;
  });
  var _0x302480 = _0xca214b ? _0xca214b.price : 0;
  return isRupiah ? _0x302480.toLocaleString("id-ID", {
    style: "currency",
    currency: "Ph Bill",
    minimumFractionDigits: 0
  }) : _0x302480.toLocaleString("en-US", {
    style: "currency",
    currency: "Kyats",
    minimumFractionDigits: 0
  });
}
function tampilkanDetailPembelian() {
  var _0x489178 = document.querySelector("input[name=\"coinOption\"]:checked");
  if (_0x489178) {
    var _0x32f10a = _0x489178.value;
    var _0x360ffc = auth.currentUser.uid;
    var _0x164df5 = generateUniqueIdx(config);
    var _0x376dd9 = document.getElementById("popup_detailsPesanan");
    document.getElementById("popupDetailPembelian");
    _0x376dd9.style.display = "block";
    db.collection("users").doc(_0x360ffc).get().then(function (_0x243cab) {
      if (_0x243cab.exists) {
        var _0x5e3f5c = _0x243cab.data();
        var _0xe58e60 = _0x5e3f5c.email;
        var _0x34c576 = _0x5e3f5c.username;
        var _0x38bc84 = getHarga(_0x32f10a);
        var _0x9867c7 = isRupiah ? "Ph Bill" : "Kyats";
        document.getElementById("detailUsername").innerText = _0x34c576 || "Tidak Tersedia";
        document.getElementById("detailEmail").innerText = _0xe58e60;
        document.getElementById("detailUID").innerText = _0x360ffc;
        document.getElementById("detailIdPesanan").innerText = _0x164df5;
        if (_0x9867c7) {
          document.getElementById("detailHarga").innerText = _0x38bc84.toLocaleString("id-ID") + " " + _0x9867c7;
        } else {
          document.getElementById("detailHarga").innerText = _0x38bc84.toLocaleString("en-Kyats") + " " + _0x9867c7;
        }
        document.getElementById("detailJumlahCoin").innerText = _0x32f10a;
      } else {
        console.error("Dokumen pengguna tidak ditemukan.");
      }
    }).catch(function (_0x2ccf4f) {
      console.error("Error saat mengambil data pengguna: ", _0x2ccf4f);
    });
  } else {
    showSwalCoin("itemCoin");
  }
}
function submitPembelian() {
  hidepopupOrder();
  showSwalCoin("loader");
  var _0x131a3b = document.querySelector("input[name=\"coinOption\"]:checked").value;
  var _0x5012f6 = auth.currentUser.uid;
  var _0x4a5bde = new Date();
  var _0x587932 = generateUniqueIdx(config);
  var _0x312b07 = parseInt(_0x131a3b);
  var _0x1d6d4f = getHarga(_0x131a3b);
  var _0x1eac1c = document.getElementById("buktiTransfer").files[0];
  if (_0x1eac1c) {
    db.collection("users").doc(_0x5012f6).get().then(function (_0x24f047) {
      if (_0x24f047.exists) {
        var _0xe34f39 = _0x24f047.data();
        var _0x8a76a0 = _0xe34f39.email;
        var _0x3297a1 = _0xe34f39.username;
        var _0x1e4939 = storagedb.ref().child("bukti_pembayaran/" + _0x5012f6 + "/" + _0x587932 + "_" + _0x1eac1c.name);
        _0x1e4939.put(_0x1eac1c).then(function (_0x3fca48) {
          console.log("Bukti transfer berhasil diunggah");
          _0x1e4939.getDownloadURL().then(function (_0x286474) {
            var _0x439c7a = {
              uidUser: _0x5012f6,
              jumlahCoin: _0x312b07,
              harga: _0x1d6d4f,
              dikonfirmasi: false,
              tanggal: _0x4a5bde,
              buktiTransfer: _0x286474,
              email: _0x8a76a0,
              username: _0x3297a1
            };
            db.collection("pembelian_User").doc(_0x5012f6).get().then(function (_0x1e0e6f) {
              var _0x7c5a53 = {
                _0x587932: _0x439c7a
              };
              if (_0x1e0e6f.exists) {
                db.collection("pembelian_User").doc(_0x5012f6).update(_0x7c5a53).then(function () {
                  var _0x5f57ec = {
                    _0x587932: _0x439c7a
                  };
                  console.log("Pesanan berhasil diperbarui");
                  db.collection("pesanan").doc(_0x5012f6).update(_0x5f57ec).then(function () {
                    console.log("Pesanan berhasil dikirim");
                    tampilkanRiwayatPembelian(_0x5012f6);
                    kirimNotifikasiTelegram(_0x587932, _0x8a76a0, _0x3297a1, _0x312b07, _0x1d6d4f, _0x1eac1c);
                  }).catch(function (_0x1cccb9) {
                    console.error("Error saat memperbarui pesanan di koleksi pesanan: ", _0x1cccb9);
                  });
                  console.log("Pesanan berhasil diperbarui");
                  db.collection("pesanan").doc(_0x5012f6).update(_0x5f57ec).then(function () {
                    console.log("Pesanan berhasil dikirim");
                    tampilkanRiwayatPembelian(_0x5012f6);
                    kirimNotifikasiTelegram(_0x587932, _0x8a76a0, _0x3297a1, _0x312b07, _0x1d6d4f, _0x1eac1c);
                  }).catch(function (_0x1cccb9) {
                    console.error("Error saat memperbarui pesanan di koleksi pesanan: ", _0x1cccb9);
                  });
                }).catch(function (_0x511d18) {
                  console.error("Error saat memperbarui pesanan: ", _0x511d18);
                  showSwalCoin("error");
                });
              } else {
                db.collection("pembelian_User").doc(_0x5012f6).set({
                  [_0x587932]: _0x439c7a
                }).then(function () {
                  var _0x210e92 = {
                    _0x587932: _0x439c7a
                  };
                  console.log("Pesanan berhasil ditambahkan");
                  db.collection("pesanan").doc(_0x5012f6).set(_0x210e92).then(function () {
                    console.log("Pesanan berhasil ditambahkan di koleksi pesanan");
                    tampilkanRiwayatPembelian(_0x5012f6);
                    kirimNotifikasiTelegram(_0x587932, _0x8a76a0, _0x3297a1, _0x312b07, _0x1d6d4f, _0x1eac1c);
                  }).catch(function (_0x9ebc0) {
                    console.error("Error saat menambahkan pesanan di koleksi pesanan: ", _0x9ebc0);
                  });
                  console.log("Pesanan berhasil ditambahkan");
                  db.collection("pesanan").doc(_0x5012f6).set(_0x210e92).then(function () {
                    console.log("Pesanan berhasil ditambahkan di koleksi pesanan");
                    tampilkanRiwayatPembelian(_0x5012f6);
                    kirimNotifikasiTelegram(_0x587932, _0x8a76a0, _0x3297a1, _0x312b07, _0x1d6d4f, _0x1eac1c);
                  }).catch(function (_0x9ebc0) {
                    console.error("Error saat menambahkan pesanan di koleksi pesanan: ", _0x9ebc0);
                  });
                }).catch(function (_0x588bd1) {
                  console.error("Error saat menambahkan pesanan: ", _0x588bd1);
                  showSwalCoin("error");
                });
              }
            }).catch(function (_0x21f90f) {
              console.error("Error saat memeriksa pesanan: ", _0x21f90f);
              showSwalCoin("error");
            });
          }).catch(function (_0x3a7d14) {
            showSwalCoin("error");
            console.error("Error saat mendapatkan URL bukti transfer: ", _0x3a7d14);
          });
        }).catch(function (_0x4fc26a) {
          showSwalCoin("error");
          console.error("Error saat mengunggah bukti transfer: ", _0x4fc26a);
        });
      } else {
        console.error("users tidak ditemukan.");
      }
    }).catch(function (_0x4931aa) {
      console.error("Error saat mengambil data pengguna: ", _0x4931aa);
    });
  } else {
    showSwalCoin("errorBuktipembayaran");
  }
}
function kirimNotifikasiTelegram(_0x256231, _0x358742, _0x56961f, _0x2eb7c6, _0x5c78c3, _0x27490b) {
  if (botToken_telegram && chatId_telegram) {
    let _0x13faef = "\n*Order*:\n\nOrder ID: " + _0x256231 + "\n\n*Username:* " + _0x56961f + "\n\n*Email:* " + _0x358742 + "\n\n*Purchase*:\n\nprice: " + _0x5c78c3 + "\n\nCoin: " + _0x2eb7c6 + "\n\n---NOTE BOT---\nPlease check user orders immediately";
    var _0x197375 = new FormData();
    _0x197375.append("chat_id", chatId_telegram);
    _0x197375.append("document", _0x27490b, _0x27490b.name);
    _0x197375.append("caption", _0x13faef);
    _0x197375.append("parse_mode", "Markdown");
    fetch("https://api.telegram.org/bot" + botToken_telegram + "/sendDocument", {
      method: "POST",
      body: _0x197375
    }).then(_0x5cfc4a => _0x5cfc4a.json()).then(_0x409a91 => {
      if (_0x409a91.ok) {
        swal.close();
        console.log("Notifikasi Telegram berhasil dikirim.");
        showSwalCoin("success");
      } else {
        console.error("Error saat mengirim notifikasi Telegram:", _0x409a91.description);
      }
    }).catch(_0x19530c => {
      console.error("Error saat mengirim notifikasi Telegram:", _0x19530c);
    });
  } else {
    showSwalCoin("errorTokenbot");
  }
}
function showSwalCoin(_0x120c4e) {
  let _0x4fd79b = swalConfigCoin[_0x120c4e];
  if (_0x4fd79b) {
    Swal.fire(_0x4fd79b);
  } else {
    console.error("Swal config for type \"" + _0x120c4e + "\" not found.");
  }
}
function buatOpsiCoin() {
  var _0x512091 = function () {
    var _0x48b0ba = true;
    return function (_0x3a19ea, _0x1d537c) {
      var _0x29dcc7 = _0x48b0ba ? function () {
        if (_0x1d537c) {
          var _0x472e89 = _0x1d537c.apply(_0x3a19ea, arguments);
          _0x1d537c = null;
          return _0x472e89;
        }
      } : function () {};
      _0x48b0ba = false;
      return _0x29dcc7;
    };
  }();
  var _0x1a42ec = _0x512091(this, function () {
    return _0x1a42ec.toString().search("(((.+)+)+)+$").toString().constructor(_0x1a42ec).search("(((.+)+)+)+$");
  });
  _0x1a42ec();
  var _0x327322 = function () {
    var _0x39fc9c = true;
    return function (_0x28cebe, _0x559d7e) {
      var _0x4c7dca = _0x39fc9c ? function () {
        if (_0x559d7e) {
          var _0x22f3a8 = _0x559d7e.apply(_0x28cebe, arguments);
          _0x559d7e = null;
          return _0x22f3a8;
        }
      } : function () {};
      _0x39fc9c = false;
      return _0x4c7dca;
    };
  }();
  var _0x2453d4 = _0x327322(this, function () {
    var _0x2902a1;
    try {
      var _0x4d6251 = Function("return (function() {}.constructor(\"return this\")( ));");
      _0x2902a1 = _0x4d6251();
    } catch (_0x3b856a) {
      _0x2902a1 = window;
    }
    var _0x53e632 = _0x2902a1.console = _0x2902a1.console || {};
    var _0x4c7693 = ["log", "warn", "info", "error", "exception", "table", "trace"];
    for (var _0x2722ed = 0; _0x2722ed < _0x4c7693.length; _0x2722ed++) {
      var _0xe5ac75 = _0x327322.constructor.prototype.bind(_0x327322);
      var _0x29e73d = _0x4c7693[_0x2722ed];
      var _0x301a77 = _0x53e632[_0x29e73d] || _0xe5ac75;
      _0xe5ac75.__proto__ = _0x327322.bind(_0x327322);
      _0xe5ac75.toString = _0x301a77.toString.bind(_0x301a77);
      _0x53e632[_0x29e73d] = _0xe5ac75;
    }
  });
  _0x2453d4();
  var _0x1ad311 = document.getElementById("coinOptions");
  _0x1ad311.innerHTML = "";
  (isRupiah ? coinConfigRupiah : coinConfigUSD).forEach(function (_0x1ecfac, _0x5f003f) {
    var _0x3dbe24 = document.createElement("div");
    var _0x330ce1 = isRupiah ? _0x1ecfac.price.toLocaleString("id-ID", {
      style: "currency",
      currency: "Ph Bill",
      minimumFractionDigits: 0
    }) : _0x1ecfac.price.toLocaleString("en-US", {
      style: "currency",
      currency: "Kyats",
      minimumFractionDigits: 0
    });
    _0x3dbe24.innerHTML = "\n       <div class=\"cardCoin\" data-coin=\"coin" + _0x5f003f + "\">\n      <input type=\"radio\" id=\"coin" + _0x5f003f + "\" name=\"coinOption\" value=\"" + _0x1ecfac.amount + "\">\n        <label for=\"coin" + _0x5f003f + "\"> \n       <div class=\"listbuyCoin\">\n    \n       <div class=\"icon_imageCoin\">\n        <img alt=\"" + _0x1ecfac.amount + " Coin\" src=\"" + logoCoin_hr + "\"/>\n        </div>\n     <div class=\"inputlistCoin\">\n    <span class=\"vCoin\"> " + _0x1ecfac.amount + "</span>\n       </div>\n     <div class=\"listpriceCoin\">     \n     <div class=\"price_discountCoin\">\n     <span class=\"discountpriceCoin\"></span>   \n     <span>" + _0x330ce1 + "</span>       \n       </div>       \n          </div>       \n       </label>  \n     </div>\n    </div>";
    _0x1ad311.appendChild(_0x3dbe24);
  });
}
document.getElementById("btnKonfirmasi").addEventListener("click", checkInputAndSubmit);
buatOpsiCoin();
