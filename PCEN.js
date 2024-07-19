function hidepopupOrder() {
  document.getElementById('popup_detailsPesanan').style.display = 'none'
}
function generateUniqueIdx(_0x648e43) {
  let _0x1d05ad = generateRandomStringx(_0x648e43.JumlahHuruf),
    _0x34a85f = generateRandomNumberx(_0x648e43.JumlahNumber)
  return _0x648e43.NameUnik + '-' + _0x1d05ad + _0x34a85f
}
function generateRandomStringx(_0x52cfab) {
  let _0x3cf1a5 = '',
    _0x2ad4fd = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    _0x20970c = _0x2ad4fd.length
  for (let _0x553b8b = 0; _0x553b8b < _0x52cfab; _0x553b8b++) {
    _0x3cf1a5 += _0x2ad4fd.charAt(Math.floor(Math.random() * _0x20970c))
  }
  return _0x3cf1a5
}
function generateRandomNumberx(_0x1a93d3) {
  let _0x226ba1 = ''
  for (let _0x882af3 = 0; _0x882af3 < _0x1a93d3; _0x882af3++) {
    _0x226ba1 += Math.floor(10 * Math.random())
  }
  return _0x226ba1
}
function checkInputAndSubmit() {
  var _0x399746 = document.getElementById('buktiTransfer')
  if (!document.getElementById('kebijakan').checked) {
    showSwalCoin('errorCentangkejibakan')
    return
  }
  if (0 === _0x399746.files.length) {
    showSwalCoin('errorBuktipembayaran')
    return
  }
  submitPembelian()
}
function tampilkanRiwayatPembelian(_0xb977e1) {
  var _0x5097ca = document.getElementById('riwayatPembelian')
  _0x5097ca.innerHTML = ''
  _0x5097ca
    ? db
        .collection('pembelian_User')
        .doc(_0xb977e1)
        .get()
        .then(function (_0x25a96a) {
          if (_0x25a96a.exists) {
            var _0x141211 = _0x25a96a.data()
            Object.keys(_0x141211).forEach(function (_0x298e45) {
              var _0x341f5a = _0x141211[_0x298e45],
                _0x500507 = document.createElement('div'),
                _0x590469 = isRupiah
                  ? _0x341f5a.harga.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'PhBill',
                      minimumFractionDigits: 0,
                    })
                  : _0x341f5a.harga.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'Kyats',
                      minimumFractionDigits: 0,
                    })
              _0x500507.innerHTML =
                '\n  <div class="listOrdercoin_users">\n  <span class="orderIdCoin"><b>Order ID:</b> <p>' +
                _0x298e45 +
                '</p></span>\n  <span class="itemOrderCoin">                      \n<b>Item:</b> <p>' +
                _0x341f5a.jumlahCoin +
                ' Coin</p>\n</span>\n  <span class="priceItemCoin">                      \n<b>Price:</b> <p>' +
                _0x590469 +
                '</p>\n</span>\n                        \n<span class="dateOrder">\n<b>Date:</b><p> ' +
                _0x341f5a.tanggal.toDate().toLocaleString() +
                '</p>\n </span>                       \n<span class="statusOrder">\n<b>Status:</b><p> ' +
                (_0x341f5a.dikonfirmasi
                  ? 'success'
                  : 'Pending (Orders need Admin approval)') +
                '</p>\n</span>\n<hr>\n  </div>\n                    '
              _0x5097ca.appendChild(_0x500507)
            })
          } else {
            document.querySelector('.belumRiwayatpembelian').innerHTML =
              riwayatPembelian_belumada
            console.log(
              'pembelian tidak ditemukan untuk pengguna dengan ID:',
              _0xb977e1
            )
          }
        })
        .catch(function (_0x8e045e) {
          console.error('Error saat mengambil riwayat pembelian: ', _0x8e045e)
        })
    : console.log(' id riwayatPembelian kosong')
}
function getHarga(_0x14632a) {
  var _0xca214b = (isRupiah ? coinConfigRupiah : coinConfigUSD).find(function (
      _0x17af51
    ) {
      return _0x17af51.amount == _0x14632a
    }),
    _0x302480 = _0xca214b ? _0xca214b.price : 0
  return isRupiah
    ? _0x302480.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'PhBill',
        minimumFractionDigits: 0,
      })
    : _0x302480.toLocaleString('en-US', {
        style: 'currency',
        currency: 'Kyats',
        minimumFractionDigits: 0,
      })
}
function tampilkanDetailPembelian() {
  var _0x489178 = document.querySelector('input[name="coinOption"]:checked')
  if (_0x489178) {
    var _0x32f10a = _0x489178.value,
      _0x360ffc = auth.currentUser.uid,
      _0x164df5 = generateUniqueIdx(config),
      _0x376dd9 = document.getElementById('popup_detailsPesanan')
    document.getElementById('popupDetailPembelian')
    _0x376dd9.style.display = 'block'
    db.collection('users')
      .doc(_0x360ffc)
      .get()
      .then(function (_0x243cab) {
        if (_0x243cab.exists) {
          var _0x5e3f5c = _0x243cab.data(),
            _0xe58e60 = _0x5e3f5c.email,
            _0x34c576 = _0x5e3f5c.username,
            _0x38bc84 = getHarga(_0x32f10a),
            _0x9867c7 = isRupiah ? 'PhBill' : 'Kyats'
          document.getElementById('detailUsername').innerText =
            _0x34c576 || 'Tidak Tersedia'
          document.getElementById('detailEmail').innerText = _0xe58e60
          document.getElementById('detailUID').innerText = _0x360ffc
          document.getElementById('detailIdPesanan').innerText = _0x164df5
          _0x9867c7
            ? (document.getElementById('detailHarga').innerText =
                _0x38bc84.toLocaleString('id-ID') + ' ' + _0x9867c7)
            : (document.getElementById('detailHarga').innerText =
                _0x38bc84.toLocaleString('en-USD') + ' ' + _0x9867c7)
          document.getElementById('detailJumlahCoin').innerText = _0x32f10a
        } else {
          console.error('Dokumen pengguna tidak ditemukan.')
        }
      })
      .catch(function (_0x2ccf4f) {
        console.error('Error saat mengambil data pengguna: ', _0x2ccf4f)
      })
  } else {
    showSwalCoin('itemCoin')
  }
}
function submitPembelian() {
  hidepopupOrder()
  showSwalCoin('loader')
  var _0x131a3b = document.querySelector(
      'input[name="coinOption"]:checked'
    ).value,
    _0x5012f6 = auth.currentUser.uid,
    _0x4a5bde = new Date(),
    _0x587932 = generateUniqueIdx(config),
    _0x312b07 = parseInt(_0x131a3b),
    _0x1d6d4f = getHarga(_0x131a3b),
    _0x1eac1c = document.getElementById('buktiTransfer').files[0]
  _0x1eac1c
    ? db
        .collection('users')
        .doc(_0x5012f6)
        .get()
        .then(function (_0x24f047) {
          if (_0x24f047.exists) {
            var _0xe34f39 = _0x24f047.data(),
              _0x8a76a0 = _0xe34f39.email,
              _0x3297a1 = _0xe34f39.username,
              _0x1e4939 = storagedb
                .ref()
                .child(
                  'bukti_pembayaran/' +
                    _0x5012f6 +
                    '/' +
                    _0x587932 +
                    '_' +
                    _0x1eac1c.name
                )
            _0x1e4939
              .put(_0x1eac1c)
              .then(function (_0x3fca48) {
                console.log('Bukti transfer berhasil diunggah')
                _0x1e4939
                  .getDownloadURL()
                  .then(function (_0x286474) {
                    var _0x439c7a = {
                      uidUser: _0x5012f6,
                      jumlahCoin: _0x312b07,
                      harga: _0x1d6d4f,
                      dikonfirmasi: false,
                      tanggal: _0x4a5bde,
                      buktiTransfer: _0x286474,
                      email: _0x8a76a0,
                      username: _0x3297a1,
                    }
                    var _0x59b19d = _0x439c7a
                    db.collection('pembelian_User')
                      .doc(_0x5012f6)
                      .get()
                      .then(function (_0x1e0e6f) {
                        var _0x7c5a53 = { _0x587932: _0x59b19d }
                        _0x1e0e6f.exists
                          ? db
                              .collection('pembelian_User')
                              .doc(_0x5012f6)
                              .update(_0x7c5a53)
                              .then(function () {
                                var _0x5f57ec = { _0x587932: _0x59b19d }
                                console.log('Pesanan berhasil diperbarui')
                                db.collection('pesanan')
                                  .doc(_0x5012f6)
                                  .update(_0x5f57ec)
                                  .then(function () {
                                    console.log('Pesanan berhasil dikirim'),
                                      tampilkanRiwayatPembelian(_0x5012f6),
                                      kirimNotifikasiTelegram(
                                        _0x587932,
                                        _0x8a76a0,
                                        _0x3297a1,
                                        _0x312b07,
                                        _0x1d6d4f,
                                        _0x1eac1c
                                      )
                                  })
                                  .catch(function (_0x1cccb9) {
                                    console.error(
                                      'Error saat memperbarui pesanan di koleksi pesanan: ',
                                      _0x1cccb9
                                    )
                                  })
                                console.log('Pesanan berhasil diperbarui'),
                                  db
                                    .collection('pesanan')
                                    .doc(_0x5012f6)
                                    .update(_0x5f57ec)
                                    .then(function () {
                                      console.log('Pesanan berhasil dikirim'),
                                        tampilkanRiwayatPembelian(_0x5012f6),
                                        kirimNotifikasiTelegram(
                                          _0x587932,
                                          _0x8a76a0,
                                          _0x3297a1,
                                          _0x312b07,
                                          _0x1d6d4f,
                                          _0x1eac1c
                                        )
                                    })
                                    .catch(function (_0x1cccb9) {
                                      console.error(
                                        'Error saat memperbarui pesanan di koleksi pesanan: ',
                                        _0x1cccb9
                                      )
                                    })
                              })
                              .catch(function (_0x511d18) {
                                console.error(
                                  'Error saat memperbarui pesanan: ',
                                  _0x511d18
                                )
                                showSwalCoin('error')
                              })
                          : db
                              .collection('pembelian_User')
                              .doc(_0x5012f6)
                              .set({ [_0x587932]: _0x59b19d })
                              .then(function () {
                                var _0x210e92 = { _0x587932: _0x59b19d }
                                console.log('Pesanan berhasil ditambahkan')
                                db.collection('pesanan')
                                  .doc(_0x5012f6)
                                  .set(_0x210e92)
                                  .then(function () {
                                    console.log(
                                      'Pesanan berhasil ditambahkan di koleksi pesanan'
                                    ),
                                      tampilkanRiwayatPembelian(_0x5012f6),
                                      kirimNotifikasiTelegram(
                                        _0x587932,
                                        _0x8a76a0,
                                        _0x3297a1,
                                        _0x312b07,
                                        _0x1d6d4f,
                                        _0x1eac1c
                                      )
                                  })
                                  .catch(function (_0x9ebc0) {
                                    console.error(
                                      'Error saat menambahkan pesanan di koleksi pesanan: ',
                                      _0x9ebc0
                                    )
                                  })
                                console.log('Pesanan berhasil ditambahkan'),
                                  db
                                    .collection('pesanan')
                                    .doc(_0x5012f6)
                                    .set(_0x210e92)
                                    .then(function () {
                                      console.log(
                                        'Pesanan berhasil ditambahkan di koleksi pesanan'
                                      ),
                                        tampilkanRiwayatPembelian(_0x5012f6),
                                        kirimNotifikasiTelegram(
                                          _0x587932,
                                          _0x8a76a0,
                                          _0x3297a1,
                                          _0x312b07,
                                          _0x1d6d4f,
                                          _0x1eac1c
                                        )
                                    })
                                    .catch(function (_0x9ebc0) {
                                      console.error(
                                        'Error saat menambahkan pesanan di koleksi pesanan: ',
                                        _0x9ebc0
                                      )
                                    })
                              })
                              .catch(function (_0x588bd1) {
                                console.error(
                                  'Error saat menambahkan pesanan: ',
                                  _0x588bd1
                                )
                                showSwalCoin('error')
                              })
                      })
                      .catch(function (_0x21f90f) {
                        console.error(
                          'Error saat memeriksa pesanan: ',
                          _0x21f90f
                        )
                        showSwalCoin('error')
                      })
                  })
                  .catch(function (_0x3a7d14) {
                    showSwalCoin('error'),
                      console.error(
                        'Error saat mendapatkan URL bukti transfer: ',
                        _0x3a7d14
                      )
                  })
              })
              .catch(function (_0x4fc26a) {
                showSwalCoin('error'),
                  console.error(
                    'Error saat mengunggah bukti transfer: ',
                    _0x4fc26a
                  )
              })
          } else {
            console.error('users tidak ditemukan.')
          }
        })
        .catch(function (_0x4931aa) {
          console.error('Error saat mengambil data pengguna: ', _0x4931aa)
        })
    : showSwalCoin('errorBuktipembayaran')
}
function kirimNotifikasiTelegram(
  _0x256231,
  _0x358742,
  _0x56961f,
  _0x2eb7c6,
  _0x5c78c3,
  _0x27490b
) {
  var _0x1d25b2 = botToken_telegram,
    _0x5f3599 = chatId_telegram
  if (_0x1d25b2 && _0x5f3599) {
    let _0x13faef =
      '\n*Order*:\n\nOrder ID: ' +
      _0x256231 +
      '\n\n*Username:* ' +
      _0x56961f +
      '\n\n*Email:* ' +
      _0x358742 +
      '\n\n*Purchase*:\n\nprice: ' +
      _0x5c78c3 +
      '\n\nCoin: ' +
      _0x2eb7c6 +
      '\n\n---NOTE BOT---\nPlease check user orders immediately'
    var _0x197375 = new FormData()
    _0x197375.append('chat_id', _0x5f3599)
    _0x197375.append('document', _0x27490b, _0x27490b.name)
    _0x197375.append('caption', _0x13faef)
    _0x197375.append('parse_mode', 'Markdown')
    fetch('https://api.telegram.org/bot' + _0x1d25b2 + '/sendDocument', {
      method: 'POST',
      body: _0x197375,
    })
      .then((_0x5cfc4a) => _0x5cfc4a.json())
      .then((_0x409a91) => {
        _0x409a91.ok
          ? (swal.close(),
            console.log('Notifikasi Telegram berhasil dikirim.'),
            showSwalCoin('success'))
          : console.error(
              'Error saat mengirim notifikasi Telegram:',
              _0x409a91.description
            )
      })
      .catch((_0x19530c) => {
        console.error('Error saat mengirim notifikasi Telegram:', _0x19530c)
      })
  } else {
    showSwalCoin('errorTokenbot')
  }
}
function showSwalCoin(_0x120c4e) {
  let _0x4fd79b = swalConfigCoin[_0x120c4e]
  _0x4fd79b
    ? Swal.fire(_0x4fd79b)
    : console.error('Swal config for type "' + _0x120c4e + '" not found.')
}
function buatOpsiCoin() {
  var _0x512091 = (function () {
    var _0x20e5ff = {
      sCjun: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      NImYM: function (_0x1929a8, _0x2c7b37) {
        return _0x1929a8 < _0x2c7b37
      },
      tdyNR: function (_0x13a330, _0x4f14e3) {
        return _0x13a330 * _0x4f14e3
      },
      xaPXM: 'Error saat mengirim notifikasi Telegram:',
      UsLZG: function (_0xd0db42, _0x5cc54f) {
        return _0xd0db42 && _0x5cc54f
      },
      XbElK: 'chat_id',
      obvXx: 'document',
      uKYqI: 'caption',
      lmFco: 'parse_mode',
      YZdyM: 'Markdown',
      YVZGb: function (_0x1289f5, _0x51cdfb, _0x227204) {
        return _0x1289f5(_0x51cdfb, _0x227204)
      },
      QQhlu: 'POST',
      uMvIP: function (_0xe9f47f, _0x2e2927) {
        return _0xe9f47f(_0x2e2927)
      },
      PlPKo: 'errorTokenbot',
      WuSBZ: 'Notifikasi Telegram berhasil dikirim.',
      JyPSl: 'success',
      fFJXj: function (_0x4d2899, _0x34cef5) {
        return _0x4d2899 !== _0x34cef5
      },
      GDiSI: 'Jvaqy',
      KmHQM: function (_0x3e46a1, _0x37d587) {
        return _0x3e46a1 === _0x37d587
      },
      uBiVj: 'iKwJr',
      HsonN: function (_0x5b40a0, _0x23e901) {
        return _0x5b40a0 === _0x23e901
      },
      PxBYr: 'ctvYR',
      PtQPU: 'pSwde',
      XVXED: function (_0x515c99, _0x1e48c9) {
        return _0x515c99 == _0x1e48c9
      },
      tdtNu: 'id-ID',
      fQfEV: 'currency',
      vEcsP: 'PhBill',
      pSYxD: 'en-US',
      Jnyxx: 'Kyats',
    }
    var _0x48b0ba = true
    return function (_0x3a19ea, _0x1d537c) {
      var _0x168409 = {
        haVNY: _0x20e5ff.sCjun,
        YAuAX: function (_0xc0c1f9, _0x166d07) {
          return _0x20e5ff.NImYM(_0xc0c1f9, _0x166d07)
        },
        vDRPo: function (_0x593fd6, _0x390ba6) {
          return _0x20e5ff.tdyNR(_0x593fd6, _0x390ba6)
        },
        dxkEq: _0x20e5ff.xaPXM,
        WtsHg: function (_0x337ed7, _0x1bb3c6) {
          return _0x20e5ff.UsLZG(_0x337ed7, _0x1bb3c6)
        },
        IzIjd: _0x20e5ff.XbElK,
        fqnAZ: _0x20e5ff.obvXx,
        EEmzc: _0x20e5ff.uKYqI,
        DPbfa: _0x20e5ff.lmFco,
        eceBx: _0x20e5ff.YZdyM,
        EFfEY: function (_0x28c46f, _0x2cb6a7, _0xba67fc) {
          return _0x20e5ff.YVZGb(_0x28c46f, _0x2cb6a7, _0xba67fc)
        },
        tYMzZ: _0x20e5ff.QQhlu,
        xhlGF: function (_0x191f40, _0x560bae) {
          return _0x20e5ff.uMvIP(_0x191f40, _0x560bae)
        },
        LbfDp: _0x20e5ff.PlPKo,
        gkzNa: _0x20e5ff.WuSBZ,
        VtFGC: function (_0x547300, _0x480f31) {
          return _0x20e5ff.uMvIP(_0x547300, _0x480f31)
        },
        GVCoD: _0x20e5ff.JyPSl,
        lcDOp: function (_0x4cab29, _0x193454) {
          return _0x20e5ff.fFJXj(_0x4cab29, _0x193454)
        },
        RQQip: _0x20e5ff.GDiSI,
        qMkfJ: function (_0x4f2c57, _0x536e9b) {
          return _0x20e5ff.KmHQM(_0x4f2c57, _0x536e9b)
        },
        oBqhj: _0x20e5ff.uBiVj,
      }
      if (_0x20e5ff.HsonN(_0x20e5ff.PxBYr, _0x20e5ff.PtQPU)) {
        var _0x559091 = _0x12e572
          ? function () {
              if (_0x4ad9cc) {
                var _0x420543 = _0x39092b.apply(_0x3f89fb, arguments)
                return (_0x50feaf = null), _0x420543
              }
            }
          : function () {}
        return (_0x181532 = false), _0x559091
      } else {
        var _0x29dcc7 = _0x48b0ba
          ? function () {
              var _0x19c7fc = {
                EXsux: _0x168409.gkzNa,
                CPGej: function (_0x5488f3, _0x386b88) {
                  return _0x168409.VtFGC(_0x5488f3, _0x386b88)
                },
                jltwx: _0x168409.GVCoD,
                Jelpk: _0x168409.dxkEq,
              }
              if (_0x168409.lcDOp(_0x168409.RQQip, _0x168409.RQQip)) {
                let _0x5ed2c5 = '',
                  _0x1aaf85 = _0x168409.haVNY,
                  _0x554ea9 = _0x1aaf85.length
                for (
                  let _0x15ec97 = 0;
                  _0x168409.YAuAX(_0x15ec97, _0x921967);
                  _0x15ec97++
                ) {
                  _0x5ed2c5 += _0x1aaf85.charAt(
                    _0xe89ece.floor(
                      _0x168409.vDRPo(_0x2c53d5.random(), _0x554ea9)
                    )
                  )
                }
                return _0x5ed2c5
              } else {
                if (_0x1d537c) {
                  if (_0x168409.qMkfJ(_0x168409.oBqhj, _0x168409.oBqhj)) {
                    var _0x472e89 = _0x1d537c.apply(_0x3a19ea, arguments)
                    return (_0x1d537c = null), _0x472e89
                  } else {
                    var _0x2ed820 = { AgbpV: _0x168409.dxkEq }
                    var _0x4dda07 = _0x2ed820,
                      _0x309783 = _0x37417d,
                      _0x2154de = _0x227f6f
                    if (_0x168409.WtsHg(_0x309783, _0x2154de)) {
                      let _0xfc4614 =
                        '\n*Order*:\n\nOrder ID: ' +
                        _0x2f8062 +
                        '\n\n*Username:* ' +
                        _0x4f65db +
                        '\n\n*Email:* ' +
                        _0x428cf0 +
                        '\n\n*Purchase*:\n\nprice: ' +
                        _0xc00e14 +
                        '\n\nCoin: ' +
                        _0x10588b +
                        '\n\n---NOTE BOT---\nPlease check user orders immediately'
                      var _0x13e082 = new _0x533782()
                      _0x13e082.append(_0x168409.IzIjd, _0x2154de)
                      _0x13e082.append(
                        _0x168409.fqnAZ,
                        _0x42bbee,
                        _0x3cb32.name
                      )
                      _0x13e082.append(_0x168409.EEmzc, _0xfc4614)
                      _0x13e082.append(_0x168409.DPbfa, _0x168409.eceBx)
                      _0x168409
                        .EFfEY(
                          _0x397ad9,
                          'https://api.telegram.org/bot' +
                            _0x309783 +
                            '/sendDocument',
                          {
                            method: _0x168409.tYMzZ,
                            body: _0x13e082,
                          }
                        )
                        .then((_0x248df2) => _0x248df2.json())
                        .then((_0x4d2767) => {
                          _0x4d2767.ok
                            ? (_0x27a471.close(),
                              _0x35baa5.log(_0x19c7fc.EXsux),
                              _0x19c7fc.CPGej(_0x437ed4, _0x19c7fc.jltwx))
                            : _0x578106.error(
                                _0x19c7fc.Jelpk,
                                _0x4d2767.description
                              )
                        })
                        .catch((_0x4e7458) => {
                          _0x4f00cf.error(_0x4dda07.AgbpV, _0x4e7458)
                        })
                    } else {
                      _0x168409.xhlGF(_0x386396, _0x168409.LbfDp)
                    }
                  }
                }
              }
            }
          : function () {}
        return (_0x48b0ba = false), _0x29dcc7
      }
    }
  })()
  var _0x1a42ec = _0x512091(this, function () {
    return _0x1a42ec
      .toString()
      .search('(((.+)+)+)+$')
      .toString()
      .constructor(_0x1a42ec)
      .search('(((.+)+)+)+$')
  })
  _0x1a42ec()
  var _0x327322 = (function () {
      var _0x39fc9c = true
      return function (_0x28cebe, _0x559d7e) {
        var _0x4c7dca = _0x39fc9c
          ? function () {
              if (_0x559d7e) {
                var _0x22f3a8 = _0x559d7e.apply(_0x28cebe, arguments)
                return (_0x559d7e = null), _0x22f3a8
              }
            }
          : function () {}
        return (_0x39fc9c = false), _0x4c7dca
      }
    })(),
    _0x2453d4 = _0x327322(this, function () {
      var _0x2902a1
      try {
        var _0x4d6251 = Function(
          'return (function() {}.constructor("return this")( ));'
        )
        _0x2902a1 = _0x4d6251()
      } catch (_0x3b856a) {
        _0x2902a1 = window
      }
      var _0x53e632 = (_0x2902a1.console = _0x2902a1.console || {}),
        _0x4c7693 = [
          'log',
          'warn',
          'info',
          'error',
          'exception',
          'table',
          'trace',
        ]
      for (var _0x2722ed = 0; _0x2722ed < _0x4c7693.length; _0x2722ed++) {
        var _0xe5ac75 = _0x327322.constructor.prototype.bind(_0x327322)
        var _0x29e73d = _0x4c7693[_0x2722ed]
        var _0x301a77 = _0x53e632[_0x29e73d] || _0xe5ac75
        _0xe5ac75['__proto__'] = _0x327322.bind(_0x327322)
        _0xe5ac75.toString = _0x301a77.toString.bind(_0x301a77)
        _0x53e632[_0x29e73d] = _0xe5ac75
      }
    })
  _0x2453d4()
  var _0x1ad311 = document.getElementById('coinOptions')
  _0x1ad311.innerHTML = ''
  ;(isRupiah ? coinConfigRupiah : coinConfigUSD).forEach(function (
    _0x1ecfac,
    _0x5f003f
  ) {
    var _0x3dbe24 = document.createElement('div'),
      _0x330ce1 = isRupiah
        ? _0x1ecfac.price.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'PhBill',
            minimumFractionDigits: 0,
          })
        : _0x1ecfac.price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'Kyats',
            minimumFractionDigits: 0,
          })
    _0x3dbe24.innerHTML =
      '\n       <div class="cardCoin" data-coin="coin' +
      _0x5f003f +
      '">\n      <input type="radio" id="coin' +
      _0x5f003f +
      '" name="coinOption" value="' +
      _0x1ecfac.amount +
      '">\n        <label for="coin' +
      _0x5f003f +
      '"> \n       <div class="listbuyCoin">\n    \n       <div class="icon_imageCoin">\n        <img alt="' +
      _0x1ecfac.amount +
      ' Coin" src="' +
      logoCoin_hr +
      '"/>\n        </div>\n     <div class="inputlistCoin">\n    <span class="vCoin"> ' +
      _0x1ecfac.amount +
      '</span>\n       </div>\n     <div class="listpriceCoin">     \n     <div class="price_discountCoin">\n     <span class="discountpriceCoin"></span>   \n     <span>' +
      _0x330ce1 +
      '</span>       \n       </div>       \n          </div>       \n       </label>  \n     </div>\n    </div>'
    _0x1ad311.appendChild(_0x3dbe24)
  })
}
document
  .getElementById('btnKonfirmasi')
  .addEventListener('click', checkInputAndSubmit)
buatOpsiCoin()
