import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { CoinProps } from "../home"
import styles from './detail.module.css'

interface ResponseData {
  data: CoinProps
}

interface ErrorData {
  error: string
}

type DataProps = ResponseData | ErrorData

const Detail = () => {
  const [coin, setCoin] = useState<CoinProps>()
  const [loading, setLoading] = useState(true)
  const { cripto } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    getCripto()
  }, [cripto])

  const getCripto = async () => {
    fetch(`https://api.coincap.io/v2/assets/${cripto}`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    })
      .then(response => response.json())
      .then((data: DataProps) => {
        if ("error" in data) {
          navigate("/")
          return
        }

        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD"
        })

        const priceCompact = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact"
        })

        const resultData = {
          ...data.data,
          formatedPrice: price.format(Number(data.data.priceUsd)),
          formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr))
        }

        setCoin(resultData)
        setLoading(false)
      })
      .catch(error => console.error("Erro:", error));

  }

  return (
    <div className={styles.container}>
      {loading ? (
        <h4 className={styles.center}>Carregando detalhes...</h4>
      ) : (
        <>
          <h1 className={styles.center}>{coin?.name}</h1>
          <h1 className={styles.center}>{coin?.symbol}</h1>

          <section className={styles.content}>
            <img
              src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
              alt="Logo da moeda"
              className={styles.logo}
            />
            <h1>{coin?.name} | {coin?.symbol}</h1>

            <p><strong>Preço: </strong>{coin?.formatedPrice}</p>

            <a>
              <strong>Mercado: </strong>{coin?.formatedMarket}
            </a>

            <a>
              <strong>Volume: </strong>{coin?.formatedVolume}
            </a>

            <a>
              <strong>Mudança 24h: </strong><span className={Number(coin?.changePercent24Hr) > 0 ? styles.protift : styles.loss} >{Number(coin?.changePercent24Hr).toFixed(3)}</span>
            </a>


          </section>
        </>

      )}
    </div>
  );

}

export default Detail