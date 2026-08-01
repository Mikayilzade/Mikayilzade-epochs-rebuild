export const MAP = { width: 16, height: 12 };
export const TERRAIN = {
  plains: { name: "Равнина", color: "#82965a", passable: true, yield: { food: 2, production: 1, science: 0 } },
  forest: { name: "Лес", color: "#315f45", passable: true, yield: { food: 1, production: 2, science: 0 } },
  hills: { name: "Холмы", color: "#80745d", passable: true, yield: { food: 0, production: 2, science: 1 } },
  water: { name: "Вода", color: "#286078", passable: false, yield: { food: 2, production: 0, science: 1 } },
  mountains: { name: "Горы", color: "#64666b", passable: false, yield: { food: 0, production: 0, science: 2 } }
};
export const UNIT_TYPES = {
  scout: { name: "Разведчик", icon: "◆", movement: 3, vision: 2 },
  settler: { name: "Поселенцы", icon: "●", movement: 2, vision: 1 },
  raider: { name: "Степной налётчик", icon: "▲", movement: 2, vision: 1 }
};
export const TECHS = {
  agriculture: { name: "Земледелие", cost: 12, description: "+1 пища поселения; открывает амбар", unlock: "Амбар" },
  masonry: { name: "Каменная кладка", cost: 22, requires: "agriculture", description: "+1 производство; статус «Город»", unlock: "Каменоломня" }
};
