function hidepopupOrder() {
  document.getElementById("popup_detailsPesanan").style.display = "none";
}

function generateUniqueIdx(config) {
  let randomString = generateRandomString(config.JumlahHuruf);
  let randomNumber = generateRandomNumber(config.JumlahNumber);
  return config.NameUnik + "-" + randomString + randomNumber;
}

function generateRandomString(length) {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateRandomNumber(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

function checkInputAndSubmit() {
  let transferProof = document.getElementById("buktiTransfer");
  if (!document.getElementById("kebijakan").checked) {
    showSwalCoin("errorCentangkejibakan");
    return;
  }
  if (transferProof.files.length === 0) {
    showSwalCoin("errorBuktipembayaran");
    return;
  }
  submitPembelian();
}

function displayPurchaseHistory(userId) {
  let historyElement = document.getElementById("riwayatPembelian");
  historyElement.innerHTML = "";
  if (historyElement) {
    db.collection("pembelian_User").doc(userId).get().then(function (doc) {
      if (doc.exists) {
        let data = doc.data();
        Object.keys(data).forEach(function (key) {
          let item = data[key];
          let div = document.createElement("div");
          let price = isRupiah ? item.harga.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }) : item.harga.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
          div.innerHTML = `
            <div class="listOrdercoin_users">
              <span class="orderIdCoin"><b>Order ID:</b> <p>${key}</p></span>
              <span class="itemOrderCoin"><b>Item:</b> <p>${item.jumlahCoin} Coin</p></span>
              <span class="priceItemCoin"><b>Price:</b> <p>${price}</p></span>
              <span class="dateOrder"><b>Date:</b><p> ${item.tanggal.toDate().toLocaleString()}</p></span>
              <span class="statusOrder"><b>Status:</b><p> ${item.dikonfirmasi ? "success" : "Pending (Orders need Admin approval)"}</p></span>
              <hr>
            </div>
          `;
          historyElement.appendChild(div);
        });
      } else {
        document.querySelector(".belumRiwayatpembelian").innerHTML = riwayatPembelian_belumada;
        console.log("Purchase not found for user with ID:", userId);
      }
    }).catch(function (error) {
      console.error("Error fetching purchase history: ", error);
    });
  } else {
    console.log("historyElement is empty");
  }
}

function getHarga(amount) {
  let config = isRupiah ? coinConfigRupiah : coinConfigUSD;
  let item = config.find(function (configItem) {
    return configItem.amount == amount;
  });
  let price = item ? item.price : 0;
  return isRupiah ? price.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }) : price.toLocaleString("en-US", { style: "currency", "USD", minimumFractionDigits: 0 });
}

function displayPurchaseDetails() {
  let selectedCoin = document.querySelector("input[name='coinOption']:checked");
  if (selectedCoin) {
    let coinValue = selectedCoin.value;
    let userId = auth.currentUser.uid;
    let uniqueId = generateUniqueIdx(config);
    let popup = document.getElementById("popup_detailsPesanan");
    document.getElementById("popupDetailPembelian");
    popup.style.display = "block";
    db.collection("users").doc(userId).get().then(function (doc) {
      if (doc.exists) {
        let userData = doc.data();
        let email = userData.email;
        let username = userData.username;
        let price = getHarga(coinValue);
        let currency = isRupiah ? "IDR" : "USD";
        document.getElementById("detailUsername").innerText = username || "Tidak Tersedia";
        document.getElementById("detailEmail").innerText = email;
        document.getElementById("detailUID").innerText = userId;
        document.getElementById("detailIdPesanan").innerText = uniqueId;
        document.getElementById("detailHarga").innerText = price.toLocaleString(isRupiah ? "id-ID" : "en-USD") + " " + currency;
        document.getElementById("detailJumlahCoin").innerText = coinValue;
      } else {
        console.error("User document not found.");
      }
    }).catch(function (error) {
      console.error("Error fetching user data: ", error);
    });
  } else {
    showSwalCoin("itemCoin");
  }
}

function submitPembelian() {
  hidepopupOrder();
  showSwalCoin("loader");
  let coinOption = document.querySelector("input[name='coinOption']:checked").value;
  let userId = auth.currentUser.uid;
  let currentDate = new Date();
  let uniqueId = generateUniqueIdx(config);
  let coinAmount = parseInt(coinOption);
  let price = getHarga(coinOption);
  let transferProof = document.getElementById("buktiTransfer").files[0];
  if (transferProof) {
    db.collection("users").doc(userId).get().then(function (doc) {
      if (doc.exists) {
        let userData = doc.data();
        let email = userData.email;
        let username = userData.username;
        let storageRef = storagedb.ref().child("bukti_pembayaran/" + userId + "/" + uniqueId + "_" + transferProof.name);
        storageRef.put(transferProof).then(function (snapshot) {
          console.log("Transfer proof uploaded successfully");
          storageRef.getDownloadURL().then(function (url) {
            let orderData = {
              uidUser: userId,
              jumlahCoin: coinAmount,
              harga: price,
              dikonfirmasi: false,
              tanggal: currentDate,
              buktiTransfer: url,
              email: email,
              username: username
            };
            db.collection("pembelian_User").doc(userId).get().then(function (orderDoc) {
              let orderUpdate = {
                [uniqueId]: orderData
              };
              if (orderDoc.exists) {
                db.collection("pembelian_User").doc(userId).update(orderUpdate).then(function () {
                  let orderUpdateData = {
                    [uniqueId]: orderData
                  };
                  console.log("Order updated successfully");
                  db.collection("pesanan").doc(userId).update(orderUpdateData).then(function () {
                    console.log("Order submitted successfully");
                    displayPurchaseHistory(userId);
                    sendTelegramNotification(uniqueId, email, username, coinAmount, price, transferProof);
                  }).catch(function (error) {
                    console.error("Error updating order in pesanan collection: ", error);
                  });
                }).catch(function (error) {
                  console.error("Error updating order: ", error);
                  showSwalCoin("error");
                });
              } else {
                db.collection("pembelian_User").doc(userId).set(orderUpdate).then(function () {
                  let orderSetData = {
                    [uniqueId]: orderData
                  };
                  console.log("Order added successfully");
                  db.collection("pesanan").doc(userId).set(orderSetData).then(function () {
                    console.log("Order added to pesanan collection successfully");
                    displayPurchaseHistory(userId);
                    sendTelegramNotification(uniqueId, email, username, coinAmount, price, transferProof);
                  }).catch(function (error) {
                    console.error("Error adding order to pesanan collection: ", error);
                  });
                }).catch(function (error) {
                  console.error("Error adding order: ", error);
                  showSwalCoin("error");
                });
              }
            }).catch(function (error) {
              console.error("Error checking order: ", error);
              showSwalCoin("error");
            });
          }).catch(function (error) {
            showSwalCoin("error");
            console.error("Error getting transfer proof URL: ", error);
          });
        }).catch(function (error) {
          showSwalCoin("error");
          console.error("Error uploading transfer proof: ", error);
        });
      } else {
        console.error("User not found.");
      }
    }).catch(function (error) {
      console.error("Error fetching user data: ", error);
    });
  } else {
    showSwalCoin("errorBuktipembayaran");
  }
}

function sendTelegramNotification(orderId, email, username, coinAmount, price, transferProof) {
  if (botToken_telegram && chatId_telegram) {
    let message = `
      *Order*:

      Order ID: ${orderId}
      Email: ${email}
      Username: ${username}
      Coin Amount: ${coinAmount}
      Price: ${price}
      Transfer Proof: ${transferProof.name}
    `;
    let telegramApiUrl = `https://api.telegram.org/bot${botToken_telegram}/sendMessage?chat_id=${chatId_telegram}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;
    fetch(telegramApiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log("Telegram notification sent:", data);
        }).catch(function (error) {
          console.error("Error parsing Telegram response:", error);
        });
      } else {
        console.error("Telegram API error:", response.status, response.statusText);
      }
    }).catch(function (error) {
      console.error("Error sending Telegram notification:", error);
    });
  }
}

function showSwalCoin(type) {
  switch (type) {
    case "loader":
      Swal.fire({
        html: `
          <div class="loaderCoin">
            <img src="https://example.com/loader.gif" alt="Loading...">
          </div>
          <p>Please wait...</p>
        `,
        allowOutsideClick: false,
        showConfirmButton: false
      });
      break;
    case "errorCentangkejibakan":
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please check the policy checkbox!",
      });
      break;
    case "errorBuktipembayaran":
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please upload a payment proof!",
      });
      break;
    case "itemCoin":
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a coin item!",
      });
      break;
    default:
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
  }
}
