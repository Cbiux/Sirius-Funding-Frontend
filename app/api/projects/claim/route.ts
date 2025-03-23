import { NextResponse } from 'next/server'
import { db } from '@/app/firebase/config'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json()
    const walletAddress = request.headers.get('x-wallet-address')

    if (!walletAddress) {
      return NextResponse.json(
        { message: 'Wallet no conectada' },
        { status: 401 }
      )
    }

    if (!projectId) {
      return NextResponse.json(
        { message: 'ID de proyecto no proporcionado' },
        { status: 400 }
      )
    }

    const projectRef = doc(db, 'projects', projectId)
    const projectDoc = await getDoc(projectRef)

    if (!projectDoc.exists()) {
      return NextResponse.json(
        { message: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    const projectData = projectDoc.data()

    // Verificar que el reclamante sea el creador del proyecto
    if (projectData.creator !== walletAddress) {
      return NextResponse.json(
        { message: 'No autorizado para reclamar los fondos' },
        { status: 403 }
      )
    }

    // Verificar que se haya alcanzado al menos el 80% de la meta
    const progress = (projectData.donationsXLM / projectData.goal) * 100
    if (progress < 80) {
      return NextResponse.json(
        { message: 'No se ha alcanzado el 80% de la meta' },
        { status: 400 }
      )
    }

    // Verificar que no se hayan reclamado los fondos anteriormente
    if (projectData.claimed) {
      return NextResponse.json(
        { message: 'Los fondos ya han sido reclamados' },
        { status: 400 }
      )
    }

    // Marcar el proyecto como reclamado
    await updateDoc(projectRef, {
      claimed: true,
      claimedAt: new Date().toISOString(),
      claimedBy: walletAddress
    })

    return NextResponse.json({ 
      message: 'Fondos reclamados exitosamente',
      amount: projectData.donationsXLM
    })
  } catch (error) {
    console.error('Error al reclamar los fondos:', error)
    return NextResponse.json(
      { message: 'Error al reclamar los fondos' },
      { status: 500 }
    )
  }
} 