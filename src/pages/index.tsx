import { GetStaticProps, NextPage } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"], weight: ["500", "700"] });

type CurrencyCode = "USD" | "EUR" | "GRA" | "CEY" | "YAR" | "CUM";
type Currency = {
  Buying: string;
  Type: "Currency" | "Gold";
};
type CurrencyWithCode = Currency & { code: CurrencyCode };

const currencyCodes: CurrencyCode[] = [
  "USD",
  "EUR",
  "GRA",
  "CUM",
  "YAR",
  "CEY",
];

const Card = ({ Buying, code, Type }: CurrencyWithCode) => {
  return (
    <div className={"card"} key={code}>
      <span
        style={{ color: Type === "Currency" ? "#85bb65" : "#ffcf40" }}
        className={inter.className}
      >
        {code}
      </span>
      <input
        onClick={(event) => {
          event.currentTarget.select();
          event.currentTarget.setSelectionRange(0, 99999);
          navigator.clipboard.writeText(event.currentTarget.value ?? "agalar");
        }}
        className={inter.className}
        value={Buying}
      />
    </div>
  );
};

const Home: NextPage<{ data: CurrencyWithCode[] }> = ({ data: datas }) => {
  console.log("jej", datas);

  return (
    <>
      <Head>
        <title>Exchange Rates</title>
        <meta name="description" content="Currency exchange rates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>
          🔁</text></svg>`}
        />
      </Head>
      <main>
        {datas.map((data) => (
          <Card key={data.code} {...data} />
        ))}
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<{
  data: CurrencyWithCode[];
}> = async () => {
  const res = await fetch("https://finans.truncgil.com/v4/today.json");
  const json: Record<CurrencyCode, Currency> = await res.json();

  return {
    props: {
      data: currencyCodes.map((code) => ({ ...json[code], code })),
    },
  };
};
