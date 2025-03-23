import { NextResponse } from 'next/server'
import { db } from '@/app/firebase/config'
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore'

export async function POST(request: Request) {
  try {
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address no proporcionada' },
        { status: 400 }
      )
    }

    const { projectId, amount } = await request.json()
    if (!projectId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Obtener el documento del proyecto
    const projectRef = doc(db, 'projects', projectId)
    const projectDoc = await getDoc(projectRef)

    if (!projectDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    const projectData = projectDoc.data()
    const currentDonations = projectData.donationsXLM || 0

    // Actualizar las donaciones
    await updateDoc(projectRef, {
      donationsXLM: increment(amount)
    })

    // Obtener el documento actualizado
    const updatedDoc = await getDoc(projectRef)
    const updatedData = updatedDoc.data()

    return NextResponse.json({
      success: true,
      donationsXLM: updatedData.donationsXLM
    })
  } catch (error) {
    console.error('Error al procesar la donación:', error)
    return NextResponse.json(
      { success: false, error: 'Error al procesar la donación' },
      { status: 500 }
    )
  }
} 