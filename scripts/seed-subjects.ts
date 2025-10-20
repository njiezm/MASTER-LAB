import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Créer des matières par défaut pour un Master IA
  const defaultSubjects = [
    {
      name: 'Machine Learning Avancé',
      description: 'Apprentissage automatique supervisé et non supervisé, réseaux de neurones',
      teacher: 'Prof. Dupont',
      schedule: 'Lundi 14h-17h',
      room: 'A101',
      color: 'blue',
      credits: 6,
      semester: 'Semestre 1',
      year: 2024
    },
    {
      name: 'Traitement du Langage Naturel',
      description: 'NLP, transformers, BERT, GPT, analyse sémantique',
      teacher: 'Dr. Martin',
      schedule: 'Mercredi 10h-13h',
      room: 'B205',
      color: 'green',
      credits: 5,
      semester: 'Semestre 1',
      year: 2024
    },
    {
      name: 'Vision par Ordinateur',
      description: 'CNN, détection d\'objets, segmentation, reconnaissance faciale',
      teacher: 'Prof. Bernard',
      schedule: 'Vendredi 9h-12h',
      room: 'C302',
      color: 'purple',
      credits: 5,
      semester: 'Semestre 2',
      year: 2024
    },
    {
      name: 'Reinforcement Learning',
      description: 'Apprentissage par renforcement, Q-learning, politiques, récompenses',
      teacher: 'Dr. Petit',
      schedule: 'Mardi 15h-18h',
      room: 'D150',
      color: 'red',
      credits: 4,
      semester: 'Semestre 2',
      year: 2024
    },
    {
      name: 'Deep Learning',
      description: 'Réseaux de neurones profonds, CNN, RNN, transformers, attention',
      teacher: 'Prof. Leroy',
      schedule: 'Jeudi 14h-17h',
      room: 'A201',
      color: 'indigo',
      credits: 6,
      semester: 'Semestre 1',
      year: 2024
    }
  ]

  console.log('Création des matières par défaut...')
  
  for (const subject of defaultSubjects) {
    await prisma.subject.create({
      data: subject
    })
  }

  console.log('Matières par défaut créées avec succès!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })