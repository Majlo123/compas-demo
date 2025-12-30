import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Warning Levels</h1>
      {data ? (
        <ul className="w-full max-w-md bg-white rounded-lg shadow overflow-hidden">
          {data.map((item: any) => (
            <li
              key={item.id}
              className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
            >
              <h3 className="font-semibold text-lg text-gray-800">
                {item.name}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Loading data from backend...</p>
      )}
    </div>
  );
}

export default App;
