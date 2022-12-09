export const LOAD_ITEMS = "items/LOAD_ITEMS";
export const UPDATE_ITEM = "items/UPDATE_ITEM";
export const REMOVE_ITEM = "items/REMOVE_ITEM";
export const ADD_ITEM = "items/ADD_ITEM";

const load = (items, pokemonId) => ({
  type: LOAD_ITEMS,
  items,
  pokemonId
});

const update = (item) => ({
  type: UPDATE_ITEM,
  item
});

const add = (item) => ({
  type: ADD_ITEM,
  item
});

const remove = (itemId, pokemonId) => ({
  type: REMOVE_ITEM,
  itemId,
  pokemonId
});

export const getItemsFromPokemon = (pokemonId) => async dispatch => {
  const response = await fetch(`/api/pokemon/${pokemonId}/items`)

  if(response.ok){
    const acquiredItem = await response.json()
    dispatch(load(acquiredItem, pokemonId))
  }
}

export const editItem = (editedItem, itemId) => async dispatch => {
  const response = await fetch(`/api/items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(editedItem)
  })
  if(response.ok){
    const changedItem = await response.json()
    dispatch(update(changedItem))
    return changedItem
  }
}

export const deleteItem = (pokemonId, itemId) => async dispatch =>{
  const response = await fetch(`/api/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
    if(response.ok){
      const deletedItem = await response.json();
      dispatch(remove(itemId, pokemonId))
      return deletedItem
    }
}

export const createItem = (createdItem, pokemonId) => async dispatch => {
  const response = await fetch(`/api/pokemon/${pokemonId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createdItem)
  });

  if(response.ok){
    const newItem = await response.json();
    dispatch(add(newItem));
    return newItem
  }
}

const initialState = {};

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ITEMS:
      const newItems = {};
      action.items.forEach(item => {
        newItems[item.id] = item;
      })
      return {
        ...state,
        ...newItems
      }
    case REMOVE_ITEM:
      const newState = { ...state };
      delete newState[action.itemId];
      return newState;
    case ADD_ITEM:
    case UPDATE_ITEM:
      return {
        ...state,
        [action.item.id]: action.item
      };
    default:
      return state;
  }
};

export default itemsReducer;
