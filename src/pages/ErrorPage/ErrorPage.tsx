import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
      <p className="text-gray-500 mb-8">
        Desculpe, a página que você está procurando não existe.
      </p>
      <Button
        onClick={() => navigate("/")}
        size="large"
        type="text"
        className="px-6 py-3 !bg-[#1FA65A] !text-white rounded-lg hover:!bg-[#59a87b] !border-none transition-colors !font-semibold"
      >
        Voltar para a página inicial
      </Button>
    </div>
  );
};
