'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

// define the shape of our table data
type Person = {
  id?: number
  name: string
  favorite_color: string
  created_at?: string
}

export default function Home() {
  const [people, setPeople] = useState<Person[]>([])
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [loading, setLoading] = useState(false)

  // Load all people when the page loads
  useEffect(() => {
    fetchPeople()
  }, [])

  // Fetch all rows from Supabase table
  async function fetchPeople() {
    setLoading(true)
    const { data, error } = await supabase
      .from('thePeople')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching data:', error.message, error.details)
    } else {
      console.log('✅ Data fetched:', data)
      setPeople(data || [])
    }
    setLoading(false)
  }

  // Insert a new person into the Supabase table
  async function addPerson() {
    if (!name.trim() || !color.trim()) {
      alert('Please enter both name and color')
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from('thePeople')
      .insert([{ name: name.trim(), favorite_color: color.trim() }])

    if (error) {
      console.error('❌ Error inserting data:', error.message, error.details)
      alert('Failed to add person. Check console for details.')
    } else {
      console.log(`✅ Added ${name} with color ${color}`)
      setName('')
      setColor('')
      fetchPeople()
    }
    setLoading(false)
  }

  // Delete a person from the database
  async function deletePerson(id: number) {
    const { error } = await supabase
      .from('thePeople')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Error deleting data:', error.message)
    } else {
      console.log(`✅ Deleted person with id ${id}`)
      fetchPeople()
    }
  }

  // Handle Enter key press
  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      addPerson()
    }
  }

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Favorite Colors 🎨
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="border border-gray-300 p-3 rounded-lg w-full sm:w-auto flex-1 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
            <input
              className="border border-gray-300 p-3 rounded-lg w-full sm:w-auto flex-1 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Favorite color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
            <button
              onClick={addPerson}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '...' : 'Add'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            People ({people.length})
          </h2>
          
          {loading && people.length === 0 ? (
            <p className="text-gray-500 italic">Loading...</p>
          ) : people.length === 0 ? (
            <p className="text-gray-500 italic">No people yet. Add someone above!</p>
          ) : (
            <ul className="space-y-3">
              {people.map((p: Person) => (
                <li 
                  key={p.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: p.favorite_color }}
                      title={p.favorite_color}
                    />
                    <div>
                      <strong className="text-gray-800">{p.name}</strong>
                      <span className="text-gray-500 text-sm ml-2">
                        — {p.favorite_color}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => p.id && deletePerson(p.id)}
                    className="text-red-500 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}




// 'use client'
// import { useState, useEffect } from 'react'
// import { supabase } from '@/lib/supabaseClient'

// // define the shape of our table data
// type Person = {
//   id?: number
//   name: string
//   favorite_color: string
// }

// export default function Home() {
//   const [people, setPeople] = useState<Person[]>([])
//   const [name, setName] = useState('')
//   const [color, setColor] = useState('')

//   // Load all people when the page loads
//   useEffect(() => {
//     fetchPeople()
//   }, [])

//   // Fetch all rows from Supabase table
//   async function fetchPeople() {
//     const { data, error } = await supabase.from('thePeople').select('*')
//     if (error) {
//       console.error('❌ Error fetching data:', error)
//     } else {
//       console.log('✅ Data fetched:', data)
//       setPeople(data || [])
//     }
//   }

//   // Insert a new person into the Supabase table
//   async function addPerson() {
//     if (!name || !color) return

//     const { error } = await supabase
//       .from('thePeople')
//       .insert([{ name, favorite_color: color }])

//     if (error) {
//       console.error('❌ Error inserting data:', error)
//     } else {
//       console.log(`✅ Added ${name} with color ${color}`)
//       setName('')
//       setColor('')
//       fetchPeople()
//     }
//   }

//   return (
//     <main className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Favorite Colors 🎨</h1>

//       <div className="flex flex-col sm:flex-row gap-2 mb-4">
//         <input
//           className="border p-2 rounded w-full sm:w-auto"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <input
//           className="border p-2 rounded w-full sm:w-auto"
//           placeholder="Favorite color"
//           value={color}
//           onChange={(e) => setColor(e.target.value)}
//         />
//         <button
//           onClick={addPerson}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Add
//         </button>
//       </div>

//       <ul className="list-disc ml-6 space-y-1">
//         {people.map((p: Person) => (
//           <li key={p.id}>
//             <strong>{p.name}</strong> — <span>{p.favorite_color}</span>
//           </li>
//         ))}
//       </ul>
//     </main>
//   )
// }
