document.addEventListener("DOMContentLoaded", function () {
  // Função para mostrar o popup de consentimento
  function showCookieConsent() {
    document.getElementById("cookieConsent").style.display = "block";
  }

  // Função para aceitar cookies
  function acceptCookies() {
    localStorage.setItem("cookieConsent", "accepted");
    document.getElementById("cookieConsent").style.display = "none";
  }

  // Função para recusar cookies
  function declineCookies() {
    localStorage.setItem("cookieConsent", "declined");
    document.getElementById("cookieConsent").style.display = "none";
  }

  // Verificar o consentimento do usuário
  if (!localStorage.getItem("cookieConsent")) {
    showCookieConsent();
  }

  // Adicionar eventos aos botões
  document
    .getElementById("acceptCookies")
    .addEventListener("click", acceptCookies);
  document
    .getElementById("declineCookies")
    .addEventListener("click", declineCookies);
});
