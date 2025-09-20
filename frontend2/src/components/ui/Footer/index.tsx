export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-petroleo text-brancoPerola py-8 px-4">
      <div className="container mx-auto flex flex-col items-center text-center">
        <img
          src={"/logo-branco-perola.svg"}
          alt="Rosana Jewellery"
          className="h-12 mb-4"
          loading="lazy"
        />
        <p className="font-MontserratRegular text-sm">
          Copyright © {year} - Todos os direitos reservados.
        </p>
        <p className="font-MontserratRegular text-xs mt-1">
          Desenvolvido pela FGV Jr.
        </p>
      </div>
    </footer>
  );
}