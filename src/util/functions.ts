// copy address keys
export const copyKeyFunc = (id: string): void => {
  // Credits: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
  const copyText = document.getElementById(id) as HTMLInputElement;
  /* Select the text field */
  //copyText.innerText;
  copyText?.select();
  copyText?.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  document.execCommand("copy");
};

export const copyToClipboard = (data: string): boolean => {
  /*const listener = (e: ClipboardEvent) => {
    e.clipboardData.setData('text/plain', data);
    e.preventDefault();
    document.removeEventListener('copy', listener);
  };
  document.addEventListener('copy', listener);
  document.execCommand('copy');*/
  let textInput: any;

  try {
    textInput = document.createElement("textarea");
    textInput.setAttribute("readonly", true);
    textInput.setAttribute("contenteditable", true);
    textInput.style.position = "fixed";
    textInput.value = data;
    document.body.appendChild(textInput);
    textInput.focus();
    textInput.select();

    const range = document.createRange();
    range.selectNodeContents(textInput);

    const textSelection = window.getSelection();
    if (textSelection != null) {
      textSelection.removeAllRanges();
      textSelection.addRange(range);
    }
    textInput.setSelectionRange(0, textInput.value.length);
    document.execCommand("copy");
  } catch (err) {
    console.error(err);
  } finally {
    document.body.removeChild(textInput);
  }
  return true;
};

const getCoingecko = (coinId: string): Promise<number> => {
  return fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
    .then((res) => res.json())
    .then((data) => {
      return data.market_data.current_price.usd;
    });
};

export const getCoingeckoCoinPrice = (coinId: string): Promise<any> => {
  return fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
    .then((res) => res.json())
    .then((data) => {
      return data.market_data.current_price;
    });
};

export const getCurrentPriceUSD = (url: string): Promise<any> => {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

export const getXPXcurrencyPrice = async (balance: number): Promise<number> => {
  const coinId = "proximax";
  const rate = await getCoingecko(coinId);
  const total = rate * balance;
  return total;
};

// export const getPrettyAddress = (address: string) => {
//   const prettyAddress = Address.createFromRawAddress(address);
//   return prettyAddress.pretty();
// }
