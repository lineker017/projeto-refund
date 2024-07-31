// Seleciona os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos na lista
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expenseQuantity = document.querySelector("aside header p span")

// Captura o evento de input para formatar o valor
amount.oninput = () => {
  // Obtém o valor atual do input e remove os caracteres não numéricos
  let value = amount.value.replace(/\D/g, "")

  // Transformar o valor em centavos (exemplo: 150/100 = 1.5 é equivalente a R$ 1,50)
  value = Number(value) / 100

  amount.value = formatCurrencyBRL(value)
}

// Captura o evento de submit do formulário para obter os valores
form.onsubmit = (event) => {
  // Previne o comportamento padrão de recarregar a página
  event.preventDefault()

  // Cria um objeto com os detalhes da nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date()
  }

  // Chama a função que irá adicionar o item na lista
  expenseAdd(newExpense)
}

// Adiciona um novo item na lista de despesas
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar o item (li) na lista (ul)
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona o nome e a categoria na div das informações da despesa
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Cria o icone de remover
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "Remove icon")

    // Adiciona os elementos dentro do item (li)
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Adiciona os elementos dentro da lista (ul)
    expenseList.append(expenseItem)

    // Limpa o form
    formClear()

    // Chama a função pra atualizar os totais
    updateTotals()
  } catch (error) {
    alert("Não foi possivel atualizar a lista de despesas.")
    console.log(error);
  }
}

// Atualiza os totais
function updateTotals() {
  try {
    // Recupera todos os itens (filhos da ul (li))
    const items = expenseList.children

    // Atualiza a quantidade de itens da lista
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // Variável pra incrementar o total
    let total = 0

    // Percorre cada item (li) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      // Pega o span que contém o valor
      const itemAmount = items[item].querySelector(".expense-amount")

      // Remove caracteres não numericos e substitui a vírgula pelo ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

      // Converte o valor para float
      value = parseFloat(value)
      
      // Verifica se o valor não é um número
      if (isNaN(value)) {
        return alert("Não foi possivel calcular o total. O valor não parece ser um número.")
      }

      // incrementa o valor total
      total += Number(value)
    }

    // Cria o small pra adicionar o R$ formatado
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Limpa o conteúdo do elemento (h2)
    expensesTotal.innerHTML = ""

    // Adiciona o símbolo da moeda e o valor total formatado
    expensesTotal.append(symbolBRL, total)
  } catch (error) {
    console.log(error);
  }
}

// Evento que captura o click nos itens da lista
expenseList.onclick = (event) => {
  // Verificar se o elemento clicado é o icone de remover
  if (event.target.classList.contains("remove-icon")) {
    const isConfirm = confirm("Tem certeza que deseja remover a despesa?")

    if (isConfirm) {
      // Obtém a li do elemento clicado
      const item = event.target.closest(".expense")

      // Remove o item da lista
      item.remove()

      // Atualiza os totais
      updateTotals()
    }
  }

}

// Limpa os inputs do form
function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus()
}

// Formata o valor no padrão BRL (Real Brasileiro)
function formatCurrencyBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}