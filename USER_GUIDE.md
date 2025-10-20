# Guide Rapide de Master Lab

## 🚀 Démarrage Rapide

### 1. Lancer l'application localement
```bash
npm run dev
```
Ouvrez `http://localhost:3000` dans votre navigateur.

### 2. Créer votre premier cours
1. Cliquez sur "Nouveau Cours" dans la barre latérale
2. Donnez-lui un nom (ex: "Mathématiques M1")
3. Cliquez sur "Créer le Cours"

### 3. Ajouter des ressources
1. Sélectionnez votre cours
2. Cliquez sur "Nouvelle Ressource"
3. Choisissez un type :
   - 📄 **PDF**: Lien vers un document
   - 📝 **Note**: Texte écrit directement
   - 🎥 **Vidéo**: Lien YouTube/Vimeo
   - 🔗 **Lien**: Site web ou article
   - 🖼️ **Image**: Lien vers une image

## 🎯 Utilisation Quotidienne

### Mode Gestion
- **Organiser**: Glissez-déposez les ressources pour les réorganiser
- **Modifier**: Cliquez sur "Modifier/Notes" pour éditer une ressource
- **Supprimer**: Cliquez sur l'icône 🗑️ pour supprimer
- **Rechercher**: Utilisez la barre de recherche pour trouver rapidement

### Mode Étude
- **Concentration**: Interface épurée pour étudier sans distractions
- **Accès rapide**: Cliquez directement sur les ressources pour les ouvrir
- **Navigation**: Parfait pour les sessions de révision

## 💾 Sauvegarde et Backup

### Export CSV (Recommandé)
1. Sélectionnez un cours
2. Dans la barre latérale, cliquez "Exporter CSV"
3. Gardez ce fichier en lieu sûr

### Import CSV
1. Cliquez "Importer CSV"
2. Sélectionnez votre fichier de sauvegarde
3. Les ressources seront ajoutées au cours actuel

## 📋 Format CSV

Si vous voulez créer un fichier CSV manuellement :
```csv
id,title,content,type,createdAt,updatedAt
"unique-id","Titre de la ressource","Contenu ou URL","type","2024-01-01T00:00:00.000Z","2024-01-01T00:00:00.000Z"
```

**Types possibles**: `pdf`, `note`, `video`, `link`, `image`

## 🔍 Conseils d'Utilisation

### Pour les Étudiants
- Créez un cours par matière
- Utilisez les notes pour les résumés
- Ajoutez les liens des vidéos de cours
- Organisez par ordre de pertinence

### Pour les Chercheurs
- Exportez régulièrement vos données
- Utilisez des noms de cours clairs
- Ajoutez des descriptions détaillées
- Classez par thématiques

## ⚡ Raccourcis et Astuces

### Recherche Efficace
- Tapez directement dans la barre de recherche
- La recherche fonctionne sur les titres ET le contenu
- Insensible à la casse

### Organisation
- Glissez les ressources les plus importantes en haut
- Utilisez des titres clairs et descriptifs
- Regroupez les ressources similaires

### Import/Export
- Faites un backup chaque semaine
- Nommez vos fichiers CSV avec la date : `cours_2024-01-15.csv`
- Gardez une copie sur Google Drive ou Dropbox

## 🐛 Problèmes Courants

**"Mes données ont disparu"**
- Les données sont dans le navigateur. Vider le cache les supprime.
- Solution : Importez votre fichier CSV de backup.

**"L'import CSV ne fonctionne pas"**
- Vérifiez que le fichier utilise l'encodage UTF-8
- Assurez-vous que les colonnes sont : id, title, content, type, createdAt, updatedAt
- Les champs textes doivent être entre guillemets

**"Les images ne s'affichent pas"**
- Utilisez des URLs complètes avec https://
- Certaines images peuvent être bloquées par le CORS
- Préférez les images hébergées sur des services publics

## 📱 Mobile vs Desktop

### Mobile
- Navigation par swipe
- Interface optimisée pour l'ajout rapide
- Mode étude idéal pour les révisions

### Desktop
- Drag & drop pour l'organisation
- Multitâche avec plusieurs fenêtres
- Idéal pour la gestion des ressources

---

**Besoin d'aide ?** Consultez le README.md complet ou regardez les tutoriels vidéo !