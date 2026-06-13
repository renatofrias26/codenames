import type { GameLanguage } from "./types";

/**
 * English word pool for generating Codenames boards.
 * Single words, uppercased at render time.
 */
export const WORD_LIST: string[] = [
  "Africa", "Agent", "Air", "Alien", "Alps", "Amazon", "Ambulance", "America",
  "Angel", "Antarctica", "Apple", "Arm", "Atlantis", "Australia", "Aztec",
  "Back", "Ball", "Band", "Bank", "Bar", "Bark", "Bat", "Battery", "Beach",
  "Bear", "Beat", "Bed", "Beijing", "Bell", "Belt", "Berlin", "Bermuda",
  "Berry", "Bill", "Block", "Board", "Bolt", "Bomb", "Bond", "Boom", "Boot",
  "Bottle", "Bow", "Box", "Bridge", "Brush", "Buck", "Buffalo", "Bug", "Bugle",
  "Button", "Calf", "Canada", "Cap", "Capital", "Car", "Card", "Carrot",
  "Casino", "Cast", "Cat", "Cell", "Centaur", "Center", "Chair", "Change",
  "Charge", "Check", "Chest", "Chick", "China", "Chocolate", "Church", "Circle",
  "Cliff", "Cloak", "Club", "Code", "Cold", "Comic", "Compound", "Concert",
  "Conductor", "Contract", "Cook", "Copper", "Cotton", "Court", "Cover",
  "Crane", "Crash", "Cricket", "Cross", "Crown", "Cycle", "Czech", "Dance",
  "Date", "Day", "Death", "Deck", "Degree", "Diamond", "Dice", "Dinosaur",
  "Disease", "Doctor", "Dog", "Draft", "Dragon", "Dress", "Drill", "Drop",
  "Duck", "Dwarf", "Eagle", "Egypt", "Embassy", "Engine", "England", "Europe",
  "Eye", "Face", "Fair", "Fall", "Fan", "Fence", "Field", "Fighter", "Figure",
  "File", "Film", "Fire", "Fish", "Flute", "Fly", "Foot", "Force", "Forest",
  "Fork", "France", "Game", "Gas", "Genius", "Germany", "Ghost", "Giant",
  "Glass", "Glove", "Gold", "Grace", "Grass", "Greece", "Green", "Ground",
  "Ham", "Hand", "Hawk", "Head", "Heart", "Helicopter", "Himalayas", "Hole",
  "Hollywood", "Honey", "Hood", "Hook", "Horn", "Horse", "Horseshoe",
  "Hospital", "Hotel", "Ice", "Ice cream", "India", "Iron", "Ivory", "Jack",
  "Jam", "Jet", "Jupiter", "Kangaroo", "Ketchup", "Key", "Kid", "King",
  "Kiwi", "Knife", "Knight", "Lab", "Lap", "Laser", "Lawyer", "Lead", "Lemon",
  "Leprechaun", "Life", "Light", "Limousine", "Line", "Link", "Lion", "Litter",
  "Lock", "Log", "London", "Luck", "Mail", "Mammoth", "Maple", "Marble",
  "March", "Mass", "Match", "Mercury", "Mexico", "Microscope", "Millionaire",
  "Mine", "Mint", "Missile", "Model", "Mole", "Moon", "Moscow", "Mount",
  "Mouse", "Mouth", "Mug", "Nail", "Needle", "Net", "New York", "Night",
  "Ninja", "Note", "Novel", "Nurse", "Nut", "Octopus", "Oil", "Olive",
  "Olympus", "Opera", "Orange", "Organ", "Palm", "Pan", "Pants", "Paper",
  "Parachute", "Park", "Part", "Pass", "Paste", "Penguin", "Phoenix", "Piano",
  "Pie", "Pilot", "Pin", "Pipe", "Pirate", "Pistol", "Pit", "Pitch", "Plane",
  "Plastic", "Plate", "Platypus", "Play", "Plot", "Point", "Poison", "Pole",
  "Police", "Pool", "Port", "Post", "Pound", "Press", "Princess", "Pumpkin",
  "Pupil", "Pyramid", "Queen", "Rabbit", "Racket", "Ray", "Revolution", "Ring",
  "Robin", "Robot", "Rock", "Rome", "Root", "Rose", "Roulette", "Round", "Row",
  "Ruler", "Satellite", "Saturn", "Scale", "School", "Scientist", "Scorpion",
  "Screen", "Scuba diver", "Seal", "Server", "Shadow", "Shakespeare", "Shark",
  "Ship", "Shoe", "Shop", "Shot", "Sink", "Skyscraper", "Slip", "Slug",
  "Smuggler", "Snow", "Snowman", "Sock", "Soldier", "Soul", "Sound", "Space",
  "Spell", "Spider", "Spike", "Spine", "Spot", "Spring", "Spy", "Square",
  "Stadium", "Staff", "Star", "State", "Stick", "Stock", "Straw", "Stream",
  "Strike", "String", "Sub", "Suit", "Superhero", "Swing", "Switch", "Table",
  "Tablet", "Tag", "Tail", "Tap", "Teacher", "Telescope", "Temple", "Theater",
  "Thief", "Thumb", "Tick", "Tie", "Time", "Tokyo", "Tooth", "Torch", "Tower",
  "Track", "Train", "Triangle", "Trip", "Trunk", "Tube", "Turkey", "Undertaker",
  "Unicorn", "Vacuum", "Van", "Vet", "Wake", "Wall", "War", "Washer",
  "Washington", "Watch", "Water", "Wave", "Web", "Well", "Whale", "Whip",
  "Wind", "Witch", "Worm", "Yard",
];

/**
 * Portuguese word pool for generating Codenames boards.
 * Single words, uppercased at render time.
 */
export const WORD_LIST_PT: string[] = [
  "Abelha", "Abóbora", "Açúcar", "Água", "Águia", "Agulha", "Alho", "Aliança",
  "Alma", "Âncora", "Anel", "Anjo", "Ano", "Aranha", "Areia", "Arma", "Arroz",
  "Asa", "Astronauta", "Atlântico", "Avião", "Avô", "Bala", "Balão", "Banana",
  "Banco", "Bandeira", "Banho", "Barba", "Barco", "Barata", "Bateria", "Beijo",
  "Bicho", "Bigode", "Boca", "Bola", "Bolha", "Bolo", "Bomba", "Borboleta",
  "Bota", "Braço", "Brasil", "Bruxa", "Bússola", "Cabeça", "Cabelo", "Cabra",
  "Caça", "Cachorro", "Café", "Caixa", "Calo", "Cama", "Câmera", "Caminho",
  "Campo", "Cana", "Caneta", "Canguru", "Cano", "Capa", "Capital", "Cara",
  "Caracol", "Carne", "Carro", "Carta", "Casa", "Casaco", "Castelo", "Cavalo",
  "Cebola", "Cobra", "Coelho", "Cogumelo", "Cola", "Colher", "Coluna", "Comédia",
  "Concha", "Coração", "Coroa", "Corpo", "Corrente", "Costa", "Couro", "Cobre",
  "Coxa", "Cravo", "Cruz", "Cubo", "Curva", "Dado", "Dança", "Data", "Dedo",
  "Dente", "Deserto", "Diamante", "Dinossauro", "Disco", "Doutor", "Dragão",
  "Égua", "Elefante", "Escada", "Escola", "Escudo", "Esfera", "Espada", "Espelho",
  "Espião", "Espinho", "Estação", "Estrela", "Fada", "Faca", "Falcão", "Fantasma",
  "Farol", "Febre", "Feijão", "Ferro", "Festa", "Figura", "Fila", "Filme",
  "Fivela", "Flecha", "Flor", "Floresta", "Fogo", "Folha", "Fonte", "Força",
  "Forno", "Foto", "Fralda", "França", "Fruta", "Fumo", "Gaita", "Galo",
  "Garfo", "Garrafa", "Gato", "Gelo", "Gigante", "Fita", "Globo", "Gola",
  "Golfinho", "Gota", "Grade", "Grama", "Guarda", "Hospital", "Igreja", "Ilha",
  "Índia", "Jacaré", "Janela", "Jardim", "Jogo", "Joia", "Laço", "Lago",
  "Lápis", "Laranja", "Leão", "Leite", "Lenço", "Letra", "Limão", "Língua",
  "Linha", "Lixo", "Lobo", "Luva", "Maçã", "Madeira", "Mala", "Mancha",
  "Mapa", "Máquina", "Mar", "Marte", "Máscara", "Médico", "Mel", "Mesa",
  "Mesopotâmia", "Mina", "Mochila", "Moeda", "Mola", "Montanha", "Morcego",
  "Mosca", "Lontra", "Motor", "Muro", "Música", "Nariz", "Navio", "Neve",
  "Ninja", "Noite", "Nota", "Nuvem", "Óculos", "Olho", "Onda", "Osso", "Ouro",
  "Ovo", "Padre", "País", "Palco", "Palha", "Palma", "Pão", "Papel", "Parque",
  "Pato", "Peixe", "Pena", "Pente", "Pera", "Pessoa", "Pé", "Pedra", "Piano",
  "Picareta", "Pilha", "Pino", "Pintor", "Pirata", "Pomar", "Planta", "Plástico",
  "Pluto", "Pneu", "Polvo", "Ponte", "Ponto", "Porta", "Porto", "Praia",
  "Prato", "Prego", "Princesa", "Quadro", "Queda", "Queijo", "Raiz", "Rainha",
  "Rato", "Rede", "Rei", "Relógio", "Rio", "Robô", "Rocha", "Roda", "Rolha",
  "Roma", "Rosa", "Roupa", "Sal", "Sapo", "Saia", "Selo", "Sereia", "Serra",
  "Sino", "Sol", "Soldado", "Sombra", "Sopa", "Tambor", "Tanque", "Tatu",
  "Teatro", "Teia", "Tela", "Telefone", "Tempo", "Tenda", "Terra", "Tesoura",
  "Teto", "Tigre", "Tinta", "Tomada", "Touro", "Trator", "Trem", "Tronco",
  "Túnel", "Urso", "Vaca", "Vassoura", "Vela", "Veia", "Vento", "Verão",
  "Vidro", "Vinho", "Violão", "Vulcão", "Zebra",
];

/** All available word pools keyed by language. */
export const WORD_LISTS: Record<GameLanguage, string[]> = {
  en: WORD_LIST,
  pt: WORD_LIST_PT,
};

/** Return the word pool for a given language (falls back to English). */
export function getWordList(language: GameLanguage): string[] {
  return WORD_LISTS[language] ?? WORD_LIST;
}
