let cardNumberInput = document.getElementById("card-number-input");
let getBalanceButton = document.getElementById("get-balance");

function loading(bool) {
  let loadingIndicator = document.querySelector(".loader");
  bool === true
    ? loadingIndicator.classList.add("loading")
    : loadingIndicator.classList.remove("loading");
}

function showError() {
  let errorEmojis = ["💔", "😭", "😥", "🥺", "😣"];
  let randomEmoji = errorEmojis[Math.floor(Math.random() * errorEmojis.length)];
  let resultParentElement = document.querySelector(".results");
  let visibleResultElement = document.querySelector(".result-value .visible");
  let resultsTitle = document.querySelector(".results .result-title");

  resultParentElement.setAttribute("data-has-results", "true");
  resultParentElement.setAttribute("aria-hidden", "false");
  resultParentElement.setAttribute("aria-busy", "false");
  resultsTitle.innerText = "Error";

  visibleResultElement.innerText = randomEmoji;
  loading(false);
}

function getBalance() {
  loading(true);
  let cardNumber = cardNumberInput.value;

  fetch(`https://nxd.cl/API_Targeta_Bip/?t=${cardNumber}&key=wWhAD1233`, {
    mode: 'no-cors' // Aquí se establece el modo no-cors
  })
    .then((response) => response.json())
    .then((data) => {
      // Asegúrate de que la respuesta de la API sea la esperada y que el estado sea '1'
      if (data.status === 1) {
        // Accede al saldo utilizando la clave correcta
        let rawBalance = data["Saldo  tarjeta:"].replace('$', '').trim();
        let formattedBalance = `$${rawBalance.replace(
          /(\d)(?=(\d{3})+(?!\d))/g,
          "$1."
        )}`;

        loading(false);
        updateBalance(rawBalance, formattedBalance);
      } else {
        showError();
      }
    })
    .catch((error) => {
      // Manejo de errores en caso de que la petición falle
      console.error('Error fetching balance:', error);
      showError();
    });
}

function updateBalance(rawBalance, formattedBalance) {
  let resultParentElement = document.querySelector(".results");
  let visibleResultElement = document.querySelector(".result-value .visible");
  let accessibleResultElement = document.querySelector(
    ".result-value .accessible"
  );

  resultParentElement.setAttribute("data-has-results", "true");
  resultParentElement.setAttribute("aria-hidden", "false");
  resultParentElement.setAttribute("aria-busy", "false");
  visibleResultElement.innerText = formattedBalance;
  accessibleResultElement.innerText = rawBalance;
}

function someCard() {
  cardNumberInput.value.length > 0
    ? (getBalanceButton.disabled = false)
    : (getBalanceButton.disabled = true);
  return cardNumberInput.value.length > 0;
}

cardNumberInput.addEventListener("input", someCard);
getBalanceButton.addEventListener("click", getBalance);
cardNumberInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && someCard) {
    getBalance();
  }
});

someCard();
