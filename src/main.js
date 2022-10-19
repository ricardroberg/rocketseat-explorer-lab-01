import IMask from "imask"

import "./css/index.css"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    default: ["black", "gray"],
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    american: ["#B1A15D", "#B1A15D"],
    elo: ["#2D57F2", "gray"],
    nubank: ["#8a05be", "#8a05be"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)
securityCodeMasked.on("accept", () => {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = securityCodeMasked.value || "123"
})

const currentYear = String(new Date().getFullYear()).slice(2)
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: currentYear,
      to: Number(currentYear) + 10,
    },
  },
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)
expirationDateMasked.on("accept", () => {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText = expirationDateMasked.value || "02/32"
})

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: " 0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: " 0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2}\d{0,12})/,
      cardtype: "mastercard",
    },
    {
      mask: " 0000 0000 0000 0000",
      regex: /^3[47][0-9]{5,}$/,
      cardtype: "american",
    },
    {
      mask: " 0000 0000 0000 0000",
      regex:
        /^(4011|431274|438935|451416|457393|4576|457631|457632|504175|627780|636297|636368|636369|(6503[1-3])|(6500(3[5-9]|4[0-9]|5[0-1]))|(6504(0[5-9]|1[0-9]|2[0-9]|3[0-9]))|(650(48[5-9]|49[0-9]|50[0-9]|51[1-9]|52[0-9]|53[0-7]))|(6505(4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-8]))|(6507(0[0-9]|1[0-8]))|(6507(2[0-7]))|(650(90[1-9]|91[0-9]|920))|(6516(5[2-9]|6[0-9]|7[0-9]))|(6550(0[0-9]|1[1-9]))|(6550(2[1-9]|3[0-9]|4[0-9]|5[0-8]))|(506(699|77[0-8]|7[1-6][0-9))|(509([0-9][0-9][0-9])))/,
      cardtype: "elo",
    },
    {
      mask: " 0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appendCard, dynamicMasked) {
    const numberCard = (dynamicMasked.value + appendCard).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return numberCard.match(item.regex)
    })

    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)
cardNumberMasked.on("accept", (code) => {
  const ccNumber = document.querySelector(".cc-info .cc-number")
  ccNumber.innerText = cardNumberMasked.value || "1234 5678 9012 3456"
  setCardType(cardNumberMasked.masked.currentMask.cardtype)
})

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", (event) => {
  event.preventDefault()
  alert("Cartão adicionado!")
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText = cardHolder.value || "NOME IMPRESSO NO CARTAO"
})
