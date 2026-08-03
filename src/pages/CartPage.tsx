import { Link } from 'react-router-dom'

export const CartPage = () => {
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-6">Корзина</h1>
      
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 text-center">
        <p className="text-zinc-400 text-lg mb-4">Ваша корзина пока пуста</p>
        <Link 
          to="/" 
          className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors"
        >
          Вернуться к каталогу
        </Link>
      </div>
    </main>
  )
}