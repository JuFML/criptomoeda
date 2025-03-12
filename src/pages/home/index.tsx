import { FormEvent, useEffect, useState } from 'react'
import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router'

export interface CoinProps {
  changePercent24Hr: string;
  explorer: string;
  id: string;
  marketCapUsd: string;
  maxSupply: string;
  name: string;
  priceUsd: string;
  rank: string;
  supply: string;
  symbol: string;
  volumeUsd24Hr: string;
  vwap24Hr: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProp {
  data: CoinProps[];
}

const Home = () => {
  const [input, setInput] = useState("")
  const [coins, setCoins] = useState<CoinProps[]>([])
  const [offset, setOffset] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    getData()
  }, [offset])

  const getData = async () => {
    fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    })
      .then(response => response.json())
      .then((data: DataProp) => {
        const coinsData = data.data

        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        })

        const priceCompact = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact"
        })

        const formatedResult = coinsData.map(item => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
          }
          return formated
        })

        const coinsList = [...coins, ...formatedResult]
        setCoins(coinsList)
      })
      .catch(error => console.error("Erro:", error));

  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (input === "") return
    navigate(`/detail/${input}`)
  }

  const handleGetMore = () => {
    setOffset(prev => prev + 10)
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda... EX bitcoin"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#FFF" />
        </button>
      </form>


      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>

        <tbody id="tbody">

          {coins.length > 0 && coins.map(coin => (
            <tr key={coin.id} className={styles.tr}>

              <td className={styles.tdLabel} data-label="Moeda">
                <div className={styles.name}>
                  <img
                    className={styles.logo}
                    alt="Logo Cripto"
                    src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                  />
                  <Link to={`/detail/${coin.id}`}>
                    <span>{coin.name}</span> | {coin.symbol}
                  </Link>
                </div>
              </td>

              <td className={styles.tdLabel} data-label="Valor mercado">
                {coin.formatedMarket}
              </td>

              <td className={styles.tdLabel} data-label="Preço">
                {coin.formatedPrice}
              </td>

              <td className={styles.tdLabel} data-label="Volume">
                {coin.formatedVolume}
              </td>

              <td className={Number(coin.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança 24h">
                <span>{Number(coin.changePercent24Hr).toFixed(3)}</span>
              </td>

            </tr>
          ))}

        </tbody>
      </table>

      <button className={styles.buttonMore} onClick={handleGetMore}>
        Carregar mais
      </button>

    </main>
  )
}

export default Home
