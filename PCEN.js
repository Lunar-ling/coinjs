function hidepopupOrder() {
  document.getElementById('popup_detailsPesanan').style.display = 'none';
}

function generateUniqueIdx(config) {
  let randomString = generateRandomString(config.JumlahHuruf),
    randomNumber = generateRandomNumber(config.JumlahNumber);
  return config.NameUnik + '-' + randomString + randomNumber;
}

function generateRandomString(length) {
  let result = '',
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateRandomNumber(length) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(10 * Math.random());
  }
  return result;
}

function checkInputAndSubmit() {
  var transferProof = document.getElementById('buktiTransfer');
  if (!document.getElementById('kebijakan').checked) {
    showSwalCoin('Please agree to the policy');
    return;
  }
  if (transferProof.files.length === 0) {
    showSwalCoin('Please upload the payment proof');
    return;
  }
  submitPembelian();
}

function displayPurchaseHistory(userId) {
  var historyElement = document.getElementById('riwayatPembelian');
  historyElement.innerHTML = '';
  if (historyElement) {
    db.collection('pembelian_User')
      .doc(userId)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var data = doc.data();
          Object.keys(data).forEach(function (key) {
            var purchase = data[key],
              orderDiv = document.createElement('div'),
              priceFormatted = purchase.harga.toLocaleString('en-US', {
                style: 'currency',
                currency: 'MMK',
                minimumFractionDigits: 0,
              });
            orderDiv.innerHTML = `
              <div class="listOrdercoin_users">
                <span class="orderIdCoin"><b>Order ID:</b> <p>${key}</p></span>
                <span class="itemOrderCoin"><b>Item:</b> <p>${purchase.jumlahCoin} Coin</p></span>
                <span class="priceItemCoin"><b>Price:</b> <p>${priceFormatted}</p></span>
                <span class="dateOrder"><b>Date:</b><p>${purchase.tanggal.toDate().toLocaleString()}</p></span>
                <span class="statusOrder"><b>Status:</b><p>${purchase.dikonfirmasi ? 'Success' : 'Pending (Orders need Admin approval)'}</p></span>
                <hr>
              </div>`;
            historyElement.appendChild(orderDiv);
          });
        } else {
          document.querySelector('.belumRiwayatpembelian').innerHTML = 'No purchase history found';
          console.log('No purchase found for user ID:', userId);
        }
      })
      .catch(function (error) {
        console.error('Error fetching purchase history: ', error);
      });
  } else {
    console.log('Empty purchase history ID');
  }
}

function getHarga(amount) {
  var coinConfig = coinConfigMMK.find(function (config) {
    return config.amount == amount;
  });
  var price = coinConfig ? coinConfig.price : 0;
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'MMK',
    minimumFractionDigits: 0,
  });
}

function displayPurchaseDetails() {
  var selectedCoinOption = document.querySelector('input[name="coinOption"]:checked');
  if (selectedCoinOption) {
    var coinAmount = selectedCoinOption.value,
      userId = auth.currentUser.uid,
      uniqueIdx = generateUniqueIdx(config),
      detailPopup = document.getElementById('popup_detailsPesanan');
    detailPopup.style.display = 'block';
    db.collection('users')
      .doc(userId)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var userData = doc.data(),
            email = userData.email,
            username = userData.username,
            priceFormatted = getHarga(coinAmount);
          document.getElementById('detailUsername').innerText = username || 'Not Available';
          document.getElementById('detailEmail').innerText = email;
          document.getElementById('detailUID').innerText = userId;
          document.getElementById('detailIdPesanan').innerText = uniqueIdx;
          document.getElementById('detailHarga').innerText = priceFormatted + ' MMK';
          document.getElementById('detailJumlahCoin').innerText = coinAmount;
        } else {
          console.error('User document not found.');
        }
      })
      .catch(function (error) {
        console.error('Error fetching user data: ', error);
      });
  } else {
    showSwalCoin('Please select a coin option');
  }
}

function submitPembelian() {
  hidepopupOrder();
  showSwalCoin('loader');
  var selectedCoinOption = document.querySelector('input[name="coinOption"]:checked').value,
    userId = auth.currentUser.uid,
    currentDate = new Date(),
    uniqueIdx = generateUniqueIdx(config),
    coinAmount = parseInt(selectedCoinOption),
    priceFormatted = getHarga(selectedCoinOption),
    transferProof = document.getElementById('buktiTransfer').files[0];
  if (transferProof) {
    db.collection('users')
      .doc(userId)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          var userData = doc.data(),
            email = userData.email,
            username = userData.username,
            storageRef = storagedb
              .ref()
              .child('bukti_pembayaran/' + userId + '/' + uniqueIdx + '_' + transferProof.name);
          storageRef
            .put(transferProof)
            .then(function () {
              console.log('Payment proof uploaded successfully');
              storageRef
                .getDownloadURL()
                .then(function (url) {
                  var purchaseData = {
                    uidUser: userId,
                    jumlahCoin: coinAmount,
                    harga: priceFormatted,
                    dikonfirmasi: false,
                    tanggal: currentDate,
                    buktiTransfer: url,
                    email: email,
                    username: username,
                  };
                  db.collection('pembelian_User')
                    .doc(userId)
                    .get()
                    .then(function (doc) {
                      var purchaseObj = { [uniqueIdx]: purchaseData };
                      if (doc.exists) {
                        db.collection('pembelian_User')
                          .doc(userId)
                          .update(purchaseObj)
                          .then(function () {
                            db.collection('pesanan')
                              .doc(userId)
                              .update(purchaseObj)
                              .then(function () {
                                console.log('Order updated successfully');
                                displayPurchaseHistory(userId);
                                sendTelegramNotification(uniqueIdx, email, username, coinAmount, priceFormatted, transferProof);
                              })
                              .catch(function (error) {
                                console.error('Error updating order in orders collection: ', error);
                              });
                          })
                          .catch(function (error) {
                            console.error('Error updating order: ', error);
                            showSwalCoin('error');
                          });
                      } else {
                        db.collection('pembelian_User')
                          .doc(userId)
                          .set(purchaseObj)
                          .then(function () {
                            db.collection('pesanan')
                              .doc(userId)
                              .set(purchaseObj)
                              .then(function () {
                                console.log('Order added successfully');
                                displayPurchaseHistory(userId);
                                sendTelegramNotification(uniqueIdx, email, username, coinAmount, priceFormatted, transferProof);
                              })
                              .catch(function (error) {
                                console.error('Error adding order in orders collection: ', error);
                              });
                          })
                          .catch(function (error) {
                            console.error('Error adding order: ', error);
                            showSwalCoin('error');
                          });
                      }
                    })
                    .catch(function (error) {
                      console.error('Error checking order: ', error);
                      showSwalCoin('error');
                    });
                })
                .catch(function (error) {
                  showSwalCoin('error');
                  console.error('Error getting payment proof URL: ', error);
                });
            })
            .catch(function (error) {
              showSwalCoin('error');
              console.error('Error uploading payment proof: ', error);
            });
        } else {
          console.error('User not found.');
        }
      })
      .catch(function (error) {
        console.error('Error fetching user data: ', error);
      });
  } else {
    showSwalCoin('Please upload the payment proof');
  }
}

function sendTelegramNotification(orderId, email, username, coinAmount, price, transferProof) {
  var botToken = botToken_telegram,
    chatId = chatId_telegram;
  if (botToken && chatId) {
    let message = `
      *Order*:
      Order ID: ${orderId}
      Username: ${username}
      Email: ${email}
      Purchase:
      Price: ${price}
      Coin: ${coinAmount}
      ---NOTE BOT---
      Please check user orders immediately`;
    var formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', transferProof);
    formData.append('caption', message);
    fetch('https://api.telegram.org/bot' + botToken + '/sendDocument', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Telegram API error: ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.ok) {
          console.log('Telegram notification sent');
          showSwalCoin('success');
        } else {
          console.error('Telegram API error: ', data);
          showSwalCoin('error');
        }
      })
      .catch((error) => {
        console.error('Telegram error: ', error);
        showSwalCoin('error');
      });
  } else {
    console.log('Telegram bot token or chat ID not provided');
  }
}
