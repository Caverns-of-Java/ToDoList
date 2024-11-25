function saveBody() {
    var bodyContent = document.body.innerHTML;
    localStorage.setItem('bodyHTML', bodyContent);
    console.log('save done')
}

var toDoContent = document.getElementById("toDoContent");
var completedContent = document.getElementById("completedContent");
var draggableZoneToDo = document.getElementById("draggableZoneToDo");
draggableZoneToDo.addEventListener('dragover', canDrop);
var draggableZoneCompleted = document.getElementById("draggableZoneCompleted");
draggableZoneCompleted.addEventListener('dragover', canDropCompleted);

document.getElementById("toDo").addEventListener("click",function(e) {
    if (e.target.classList.contains('sparkle')){
        e.target.classList.remove('sparkle');
    }
    if (e.target.classList.contains("active")) {
        return
    };
    e.target.classList.toggle("active");
    document.getElementById("completed").classList.remove("active");
    completedContent.classList.toggle("inactive");
    toDoContent.classList.toggle("inactive");
});

document.getElementById("completed").addEventListener("click",function(e) {
    if (e.target.classList.contains("active")) {
        return
    };
    e.target.classList.toggle("active");
    document.getElementById("toDo").classList.remove("active");
    toDoContent.classList.toggle("inactive");
    completedContent.classList.toggle("inactive");
});

var sortButton = document.getElementById('sort');
sortButton.addEventListener('click', function sort(e) {
    if (e.target.getAttribute('id') == 'sort' || e.target instanceof SVGElement) {
        sortButton.classList.toggle('buttonActive');
    }
    let sortIcon = document.querySelector('#sort svg');
    if ((e.target.getAttribute('id') == 'sort' || e.target instanceof SVGElement) && sortIcon.getAttribute('fill') == '#fff') {
        sortIcon.setAttribute('fill','#000000');
    } else {
        sortIcon.setAttribute('fill','#fff');
    }
    if (sortButton.classList.contains('buttonActive')) {
        sortButton.querySelector('.window').classList.remove('inactive');
        document.getElementById('createSort').removeEventListener('click',handleCreateSort);
        document.getElementById('modifySort').removeEventListener('click',handleModifySort);
        document.getElementById('createSort').addEventListener('click',handleCreateSort);
        document.getElementById('modifySort').addEventListener('click', handleModifySort);
    } else {
        sortButton.querySelector('.window').classList.add('inactive');
        document.getElementById('createSort').removeEventListener('click',handleCreateSort);
        document.getElementById('modifySort').removeEventListener('click',handleModifySort);
    }
});
function handleCreateSort(e) {
    //I think bring in the sortFunction call, make it take another argument to determine whether to ascend or descend
    //change the sortFunction's array sort to be conditional on this second parameter
    if (e.target.classList.contains('ascend')) {
        sortFunction('create','ascend');
        document.getElementById('createSort').textContent = "Click to sort by latest to oldest by Created date.";
        e.target.classList.remove('ascend');
        e.target.classList.add('descend');
        console.log('ascension run');
    } else if (e.target.classList.contains('descend')) {
        sortFunction('create','descend');
        document.getElementById('createSort').textContent = "Click to sort by oldest to latest by Created date.";
        e.target.classList.remove('descend');
        e.target.classList.add('ascend');
        console.log('descension run');
    }
};
function handleModifySort(e) {
    if (e.target.classList.contains('ascend')) {
        sortFunction('modify','ascend');
        document.getElementById('modifySort').textContent = "Click to sort by latest to oldest by Modified date.";
        e.target.classList.remove('ascend');
        e.target.classList.add('descend');
        console.log('ascension run');
    } else if (e.target.classList.contains('descend')) {
        sortFunction('modify','descend');
        document.getElementById('modifySort').textContent = "Click to sort by oldest to latest by Modified date.";
        e.target.classList.remove('descend');
        e.target.classList.add('ascend');
        console.log('descension run');
    }
}

function sortFunction(type, direction) {
    var characteristicToSort = "";
    var arrayOfTime = [];
    if (type == "create") {
        characteristicToSort = "data-create";
    } else {
        characteristicToSort = "data-modified";
    }
    if (document.getElementById('toDo').classList.contains('active')) {
        let collection = draggableZoneToDo.querySelectorAll('[' + characteristicToSort + ']');
        collection.forEach(function(c) {
            arrayOfTime.push(c.getAttribute(characteristicToSort));
            c.parentElement.setAttribute('data-sort',c.getAttribute(characteristicToSort));
            /*if (!c.getAttribute(characteristicToSort)) {
                c.parentElement.setAttribute('data-sort',c.getAttribute(characteristicToSort));
                arrayOfTime.push(c.getAttribute(characteristicToSort));
                } else {
                c.parentElement.setAttribute('data-sort',-1);
                arrayOfTime.push(-1);
            }*/
        });
    } else if (document.getElementById('completed').classList.contains('active')) {
        let collection = draggableZoneCompleted.querySelectorAll('[' + characteristicToSort + ']');
        collection.forEach(function(c) {
            arrayOfTime.push(c.getAttribute(characteristicToSort));
            c.parentElement.setAttribute('data-sort',c.getAttribute(characteristicToSort));
        });
    }
    if (direction == 'ascend') {
        arrayOfTime.sort((a,b) =>{
            return a-b;
        }); 
    } else if (direction == 'descend') {
        arrayOfTime.sort((a,b) =>{
            return b-a;
    });
    }
    if (document.getElementById('toDo').classList.contains('active')) {
        arrayOfTime.forEach(function(a) {
            let element = toDoContent.querySelector('['+characteristicToSort + '=' + '"' + a + '"' + ']');
            draggableZoneToDo.appendChild(element.parentElement);
        });
    } else if (document.getElementById('completed').classList.contains('active')) {
        arrayOfTime.forEach(function(a) {
            let element = completedContent.querySelector('['+characteristicToSort + '=' + '"' + a + '"' + ']');
            draggableZoneCompleted.appendChild(element.parentElement);
        })
    }
    //then do it for completeed tab
    //then clear all data-sort first before doing it using removeAttribute
    //then work out how to reverse the direction, and stylise
}
//function for sort
//opens window with two options
//created or modified
//on click of created, will identify all data-create
//apply a data-attribute for sorting of the same value to the list item wrapper
//then append child according this order
//on click again, then prepend the children in this order

//function to add Event Listeners; remember to delete the console logs
/*function fromToDo(e) {
    if (!e.target.nextElementSibling.value) {
        e.target.checked = false;
        return;
    };
    e.target.removeEventListener('click', fromToDo);
    let listItem = e.target.parentNode.parentNode;
    e.target.nextElementSibling.classList.add("strikethrough");
    e.target.nextElementSibling.setAttribute('disabled','true');
    //console.log(e.target.nextElementSibling.getAttribute('contenteditable'));
    setTimeout(()=>{
        draggableZoneCompleted.appendChild(listItem);
        if (draggableZoneCompleted.children.length >= 1) {
            document.getElementById("noComplete").classList.add("inactive");
        }
        e.target.nextElementSibling.classList.remove("strikethrough");
    }, 1000);
    
    e.target.addEventListener('click', fromCompleted);
    console.log(draggableZoneToDo.children.length);
    if (draggableZoneToDo.children.length == 1) {
        draggableZoneToDo.appendChild(createListItem());
    }
    if (!e.target.checked) {
        e.target.checked = true;
    }
    console.log("i'm in ToDo");
}
    */
function fromCompleted(e) {
    /*if (!e.target.nextElementSibling.value) {
        e.target.checked = false;
        return;
    };*/
    e.target.removeEventListener('click', fromCompleted);
    let listItem = e.target.parentNode.parentNode;
    listItem.classList.add("opacityOne");
    e.target.nextElementSibling.removeAttribute('disabled');
    setTimeout(()=> {
        e.target.checked = false;
        draggableZoneToDo.appendChild(listItem);
        console.log("i'm in fromCompleted");
        
        listItem.classList.remove("opacityOne");
    }, 500);
    e.target.addEventListener('click', fromToDo);
    setTimeout(()=> {
        if (draggableZoneCompleted.children.length == 0) {
        document.getElementById("noComplete").classList.remove("inactive");
        }
    }, 500);
};

//on load, add in a list item
if (draggableZoneToDo.children.length == 0) {
    console.log("this is done");
    //createsListItem as appropriate, but on reload, it removes its event listeners
    draggableZoneToDo.appendChild(createListItem());
}
//Create ListItem function
function createListItem() {
    let listItemWrapper = document.createElement('div');
    listItemWrapper.classList.add('listItemWrapper');
    listItemWrapper.setAttribute('draggable','true');
    listItemWrapper.addEventListener('dragstart',dragStart);
    let listItemCreate = document.createElement("div");
    listItemCreate.classList.add("listItem");
    let checkboxCreate = document.createElement("input");
    checkboxCreate.setAttribute("type", "checkbox");
    checkboxCreate.addEventListener('click', fromToDo);
    checkboxCreate.addEventListener('click',function(e) {
        if (!e.target.nextElementSibling.value) {
            return
        } else {
            createModifyLastUpdate(e);
        }
    });
    listItemCreate.appendChild(checkboxCreate);
    let textboxCreate = document.createElement("input");
    textboxCreate.setAttribute("type", "text");
    textboxCreate.setAttribute("maxlength", "75");
    textboxCreate.classList.add("textItem");
    textboxCreate.addEventListener('input',createModifyLastUpdate);
    listItemCreate.appendChild(textboxCreate);
    let caratCreate = document.createElement("span");
    caratCreate.classList.add('carat');
    caratCreate.textContent = "^";
    caratCreate.addEventListener('click', rotate);
    listItemCreate.appendChild(caratCreate);
    listItemWrapper.appendChild(listItemCreate);
    //create another div above editable divbox container for categories
    let categoryBox = document.createElement('div');
    categoryBox.classList.add('categoryBox');
    var clickToReveal = document.createElement('div');
    clickToReveal.textContent = "Click to add up to three categories";
    clickToReveal.addEventListener('click', revealCategories);
    categoryBox.appendChild(clickToReveal);
    let divBox = document.createElement('div');
    divBox.classList.add('divBox');
    divBox.setAttribute('contenteditable',true);
    divBox.textContent = "Edit me";
    divBox.addEventListener('blur',createModifyLastUpdate);
    divBox.addEventListener('click', function recordText(e) {
        let storage = e.target.textContent;
        e.target.setAttribute('data-text', storage);
    })
    listItemWrapper.appendChild(categoryBox);
    listItemWrapper.appendChild(divBox);
    listItemWrapper.appendChild(createTimeStampDiv());
    return listItemWrapper;
}

//create timestamp div
function createTimeStampDiv() {
    let timeStampDiv = document.createElement('small');
    let now = new Date();
    timeStampDiv.textContent = "Created: " + now.toLocaleString();
    timeStampDiv.setAttribute('data-create',now.getTime());
    timeStampDiv.setAttribute('data-modified', -1);
    return timeStampDiv;
}

//create timedstamp of last modified
//add event listener to list item wrapper ?
function createModifyLastUpdate(e) {
    let timeStampDiv = document.createElement('small');
    let now = new Date();
    timeStampDiv.textContent = "Modified: " + now.toLocaleString();
    timeStampDiv.setAttribute('data-modified',now.getTime());
    if (e.target.nodeName == 'INPUT') {
        //if listitemwrapper has 5 or more children, then remove the last child createModifyLastUpdate
        if (e.target.parentElement.parentElement.childElementCount >= 5) {
            e.target.parentElement.parentElement.lastChild.remove();
            e.target.parentElement.parentElement.appendChild(timeStampDiv);
        } else {
            e.target.parentElement.parentElement.appendChild(timeStampDiv);
        }
    } else if (e.target.classList.contains('categoryButton') || e.target.parentElement.classList.contains('added')) {
        if (e.target.parentElement.parentElement.parentElement.childElementCount >= 5) {
            e.target.parentElement.parentElement.parentElement.lastChild.remove();
            e.target.parentElement.parentElement.parentElement.appendChild(timeStampDiv);
        } else {
            e.target.parentElement.parentElement.parentElement.appendChild(timeStampDiv);
        }
    } else if (e.target.classList.contains('divBox')) {
        if (e.target.textContent != e.target.getAttribute('data-text')) {
            if (e.target.parentElement.childElementCount >= 5) {
                e.target.parentElement.lastChild.remove();
                e.target.parentElement.appendChild(timeStampDiv);
            } else {
                e.target.parentElement.appendChild(timeStampDiv);
            }
        }
    } else {
        if (e.target.parentElement.childElementCount >= 5) {
            e.target.parentElement.lastChild.remove();
            e.target.parentElement.appendChild(timeStampDiv);
        } else {
            e.target.parentElement.appendChild(timeStampDiv);
        }
    }
    timeStampDiv.previousElementSibling.removeAttribute('data-modified');
}
document.getElementById("plusButton").addEventListener('click', function(){
    draggableZoneToDo.appendChild(createListItem());
    if (document.getElementById('completed').classList.contains('active')) {
        document.getElementById('toDo').classList.add('sparkle');
    };
});

//function to rotate carat and append div for input
function rotate(e) {
    e.target.classList.toggle('rotate');
    e.target.parentElement.parentElement.classList.toggle('reveal');
}

//function to reveal a scrollable box into the Category Houser
function revealCategories(e) {
    var categoryWindow = document.createElement('div');
    categoryWindow.classList.add('categoryWindow');
    e.stopPropagation();
    if (document.querySelector('.categoryHouser').textContent.trim() == "" && e.target.parentElement.childNodes.length == 1) {
        e.target.textContent = "";
        categoryWindow.textContent = "No categories to show.";
        categoryWindow.style.fontStyle = "italic";
        e.target.parentElement.appendChild(categoryWindow);
        setTimeout(function() {
            e.target.textContent = "Click to add up to three categories";
            e.target.parentElement.removeChild(categoryWindow);
        },2000);
    } else if (document.querySelector('.categoryHouser').textContent.trim() != "") {
        categoryWindow.innerHTML = document.querySelector('.categoryHouser').innerHTML;
        e.target.parentElement.appendChild(categoryWindow);
        e.target.textContent = "";
        for (const child of categoryWindow.children) {
            child.addEventListener('click',cloneAndAttach);
            //on adding a category, create modified timestamp
            child.addEventListener('click',createModifyLastUpdate);
        }
        document.addEventListener('click',function removeCategoryBox(f) {
            if (!categoryWindow.contains(f.target)) {
                categoryWindow.parentElement.removeChild(categoryWindow);
                e.target.textContent = "Click to add up to three categories";
                document.removeEventListener('click',removeCategoryBox);
            }
        });
        
    }
    /* On click of any items in the houser, to clone it and prepend to the category box
    */
   function cloneAndAttach(c) {
    var addedList = c.target.parentElement.parentElement.querySelectorAll('.added');
    var duplicate = false;
    var addedListCount = 0;
    addedList.forEach((n) => {
        if (n.getAttribute('data-category') == c.target.getAttribute('data-category')) {
            duplicate = true;
        }
    });
    addedList.forEach((n) => {
        if (n.nodeType == Node.ELEMENT_NODE) {
            addedListCount += 1;
        }
    });
    //add in or condition for when child elements is 3 or greater
    if (duplicate == true || addedListCount >=3) {
        return
    } else {
        var cloned = c.target.cloneNode(true);
        cloned.style.width = "fit-content";
        cloned.style.display = "inline-block";
        cloned.style.margin = "0.1rem";
        cloned.classList.add('added');
        cloned.addEventListener('click', addTrashCan);
        categoryWindow.parentElement.prepend(cloned);
        c.target.removeEventListener('click',cloneAndAttach);
    }
   }
};
//function to add trash can and remove
function addTrashCan(e) {
    if (e.target.children.length < 1) {
        var trashCan = document.createElement('span');
        trashCan.textContent = "🗑️";
        trashCan.style.marginLeft = "var(--smallMargin)";
        trashCan.addEventListener('click', createModifyLastUpdate);
        trashCan.addEventListener('click', (f) => {
            f.target.parentElement.remove();
        });
        e.target.appendChild(trashCan);
        e.target.addEventListener('blur', function() {
            e.target.removeChild(trashCan);
        })
    }
}

document.getElementById('categoriesButton').addEventListener('click', function(e) {
    e.target.classList.toggle('buttonActive');
    if (e.target.classList.contains('buttonActive')) {
        e.target.textContent = 'Back to To Do List';
    } else {
        e.target.textContent = 'Categories';
    }
    document.getElementById('tabsAndContent').classList.toggle('inactive');
    document.querySelector('.categoriesSheet').classList.toggle('inactive');
    document.querySelector('.addCategoryButton').addEventListener('click',(e) => {
        if (e.target.textContent == 'Add Category') {
            e.target.textContent = "";
        };
    });
    document.querySelector('.addCategoryButton').addEventListener('blur', (e) => {
        if (e.target.textContent == "") {
            e.target.textContent = 'Add Category';
        };
        if (e.target.textContent.length >20) {
            e.target.textContent = e.target.textContent.substring(0,21);
        };
        if (document.querySelector('input[type=color]').value == "#000000" && e.target.textContent != "Add Category") {
            e.target.style.borderColor = "#000000";
        }
    });
    document.querySelector('input[type=color]').addEventListener('change', (e) => {
        let color1 = e.target.value;
        let red1 = parseInt(color1.substring(1,3),16);
        let green1 = parseInt(color1.substring(3,5),16);
        let blue1 = parseInt(color1.substring(5,7),16);
        let red2 = Math.floor(red1*(0.9));
        let green2 = Math.floor(green1*(0.9));
        let blue2 = Math.floor(blue1*(0.9));
        let color2 = "#" + red2.toString(16).padStart(2,"0") +
                    green2.toString(16).padStart(2,"0") +
                    blue2.toString(16).padStart(2,"0");
        document.querySelector('.addCategoryButton').style.backgroundColor = color1;
        console.log(color1);
        console.log(color2);
        document.querySelector('.addCategoryButton').style.borderColor = color2;
    });
    document.getElementById('saveToList').addEventListener('click', () => {
        var addCategoryButton = document.querySelector('.addCategoryButton');
        addCategoryButton.setAttribute('data-category',addCategoryButton.textContent + addCategoryButton.style.borderColor);
        var listOfDataCategories = [];
        Array.from(document.querySelector('.categoryHouser').children).forEach(function(c) {
            listOfDataCategories.push(c.getAttribute('data-category'));
        });
        if (addCategoryButton.textContent != "Add Category" && !listOfDataCategories.includes(addCategoryButton.getAttribute('data-category'))) {
            document.querySelector('.categoryHouser').appendChild(addCategoryButton);
            addCategoryButton.classList.remove('addCategoryButton');
            addCategoryButton.classList.add('categoryButton');
            addCategoryButton.setAttribute('tabindex','1');
            addCategoryButton.style.padding = '0.5rem';
            addCategoryButton.style.borderRadius = '0.5rem';
            addCategoryButton.setAttribute('contenteditable', 'false');
            addCategoryButton.addEventListener('click',addTrashCan);
            var newCategoryButton = document.createElement('div');
            newCategoryButton.setAttribute('contenteditable','true');
            newCategoryButton.classList.add('addCategoryButton');
            newCategoryButton.textContent = 'Add Category';
            document.querySelector('.categoryInput').prepend(newCategoryButton);
            document.querySelector('.addCategoryButton').addEventListener('click',(e) => {
                if (e.target.textContent == 'Add Category') {
                    e.target.textContent = "";
                };
            });
            document.querySelector('.addCategoryButton').addEventListener('blur', (e) => {
                if (e.target.textContent == "") {
                    e.target.textContent = 'Add Category';
                };
                if (e.target.textContent.length >20) {
                    e.target.textContent = e.target.textContent.substring(0,21);
                };
                if (document.querySelector('input[type=color]').value == "#000000" && e.target.textContent != "Add Category") {
                    e.target.style.borderColor = "#000000";
                }
            });
        }
    });
});

document.getElementById('filterButton').addEventListener('click',(e)=> {
    var categoriesAdded = document.querySelectorAll('.categoryButton.added');
    if (categoriesAdded.length > 0) {
        if (e.target.getAttribute('id') == 'filterButton') {
            e.target.classList.toggle('buttonActive');
        }
        if (e.target.classList.contains('buttonActive')) {
            var filterWindow = document.createElement('div');
            filterWindow.classList.add('window');
            e.target.appendChild(filterWindow);
            console.log(categoriesAdded);
            let filterCategoryData = [];
            categoriesAdded.forEach(function (c) {
                let dataCategory = c.getAttribute('data-category');
                if (!filterCategoryData.includes(dataCategory)){
                    let cloneCategory = c.cloneNode(true);
                    cloneCategory.classList.remove('added');
                    cloneCategory.style.color = 'initial';
                    cloneCategory.addEventListener('click',applyFilter);
                    filterWindow.appendChild(cloneCategory);
                    filterCategoryData.push(dataCategory);
                }
            });
            let noCategoryButton = document.createElement('div');
            noCategoryButton.classList.add('categoryButton');
            noCategoryButton.textContent = 'Items with no categories';
            noCategoryButton.style.borderColor = 'black';
            noCategoryButton.style.color = 'initial';
            noCategoryButton.style.borderRadius = 'var(--smallMargin)';
            noCategoryButton.style.padding = 'var(--smallMargin)';
            noCategoryButton.addEventListener('click',applyFilter);
            noCategoryButton.setAttribute('id','noCategoryButton');
            filterWindow.appendChild(noCategoryButton);
            filterWindow.addEventListener('mousedown', filterWindowReposition);
            let isDragging, offsetX, offsetY;
            function filterWindowReposition(e) {
                isDragging = true;
                initialX = filterWindow.getBoundingClientRect().left;
                initialY = filterWindow.getBoundingClientRect().top;

                filterWindow.style.position = 'fixed';
                filterWindow.style.left = `${initialX}px`;
                filterWindow.style.top = `${initialY}px`;

                offsetX = e.clientX - filterWindow.getBoundingClientRect().left;
                offsetY = e.clientY - filterWindow.getBoundingClientRect().top;
                document.addEventListener('mousemove', adjustPosition);
                document.addEventListener('mouseup', releaseDrag);
            };
            function adjustPosition(e) {
                if (isDragging) {
                    filterWindow.style.left = `${e.clientX - offsetX}px`;
                    filterWindow.style.top = `${e.clientY - offsetY}px`;
                }
            }
            function releaseDrag() {
                isDragging = false;
                document.removeEventListener('mousemove', adjustPosition);
                document.removeEventListener('mouseup', releaseDrag);
            }
            //make filterWindow position fixed so that it is relative to the window
            //add drag event listener
        } else if (e.target.getAttribute('id') == 'filterButton') {
            e.target.children[0].remove();
            appliedFilters = 0;
            //remove all inactive classes from listitems
            var listItems = document.querySelectorAll('.listItemWrapper');
            listItems.forEach(function(l) {
                l.classList.remove('inactive');
            });

        }
    } else {
        let temp = document.createElement('div');
        e.target.style.position = 'relative';
        temp.style.position = 'absolute';
        temp.style.top = '3rem';
        temp.style.border = '0px solid white';
        temp.style.width = 'max-content';
        temp.textContent = "Apply categories first";
        e.target.appendChild(temp);
        setTimeout(function() {
            temp.remove();
        },1000)
        console.log("no categories added");
    }
});
var appliedFilters = 0;
var appliedFilterCategories = [];
function applyFilter(e) {
    console.log("before click:" + appliedFilters);
    e.stopPropagation();
    e.target.classList.toggle('buttonActive');
    e.target.style.color = '#fff';
    //this section puts the datacategories in
    if (e.target.classList.contains('buttonActive')) {
        appliedFilters +=1;
        appliedFilterCategories.push(e.target.getAttribute('data-category'));
        console.log(appliedFilterCategories);
    } else {
        appliedFilters -=1;
        e.target.style.color = 'black';
        for (let i = appliedFilterCategories.length - 1; i >= 0; i--) {
            if (appliedFilterCategories[i] == e.target.getAttribute('data-category')) {
                appliedFilterCategories.splice(i,1);
                console.log(appliedFilterCategories);
            }
        }
    }
    if (appliedFilters == 1) {
        var listItems = document.querySelectorAll('.listItemWrapper');
        listItems.forEach(function(l) {
            l.classList.add('inactive');
        });
        let addedCategories = document.querySelectorAll('.added');
        addedCategories.forEach(function(a) {
            if (appliedFilterCategories.includes(a.getAttribute('data-category'))) {
                a.parentElement.parentElement.classList.remove('inactive');
            }
        });
        filterNoCategoryItems(e);
    } else if (appliedFilters == 0) {
        var listItems = document.querySelectorAll('.listItemWrapper');
        listItems.forEach(function(l) {
            l.classList.remove('inactive');
        });
    } else {
        let addedCategories = document.querySelectorAll('.added');
        addedCategories.forEach(function(a) {
            if (appliedFilterCategories.includes(a.getAttribute('data-category'))) {
                a.parentElement.parentElement.classList.remove('inactive');
            }
        });
        filterNoCategoryItems(e);
    }
    console.log("now: " + appliedFilters);
}
function filterNoCategoryItems(e) {
    //if noCategoryButton is active, then it should show the ones that have no categoory
    let noCategoryButton = document.getElementById('noCategoryButton');
    if (noCategoryButton.classList.contains('buttonActive')) {
        console.log('yes');
        let categoryBoxes = document.querySelectorAll('.categoryBox');
        categoryBoxes.forEach((c)=>{
            if (c.childElementCount == 1) {
                c.parentElement.classList.remove('inactive');
            }
        });   
    }
    /*if (e.target.getAttribute('data-category') == null) {
        console.log("target has no category");
        let categoryBoxes = document.querySelectorAll('.categoryBox');
        categoryBoxes.forEach((c)=>{
            if (c.childElementCount == 1) {
                c.parentElement.classList.remove('inactive');
            }
        });   
    }*/
}

/*********************************\
 section about Drag and Drop
\*********************************/
function dragStart(e) {
    e.target.classList.add('isBeingDragged');
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.addEventListener('dragend', (f)=>{
        f.target.classList.remove('isBeingDragged');
        document.getElementById('trash').classList.remove('trashEnabled');
        document.getElementById('trash').classList.add('inactive');
    });
    document.getElementById('trash').classList.add('trashEnabled');
    document.getElementById('trash').classList.remove('inactive');
    document.getElementById('trash').addEventListener('dragover',(e)=> {
        e.preventDefault();
    });
}   
function canDrop(e) {
    e.preventDefault();
    const afterElement = determineClosestAfterElement(draggableZoneToDo, e.clientY);
    const draggedElement = document.querySelector('.isBeingDragged');
    if (afterElement == null) {
        draggableZoneToDo.appendChild(draggedElement);
    } else {
        draggableZoneToDo.insertBefore(draggedElement, afterElement);
    }
}
function canDropCompleted(e) {
    e.preventDefault();
    const afterElement = determineClosestAfterElement(draggableZoneCompleted, e.clientY);
    const draggedElement = document.querySelector('.isBeingDragged');
    if (afterElement == null) {
        draggableZoneCompleted.appendChild(draggedElement);
    } else {
        draggableZoneCompleted.insertBefore(draggedElement, afterElement);
    }
}
function dropInBin(e) {
    e.preventDefault();
    document.querySelector('.isBeingDragged').remove();
    if (draggableZoneToDo.children.length == 0) {
        setTimeout(function() {
            draggableZoneToDo.appendChild(createListItem());
        },500);
    }
    if (draggableZoneCompleted.children.length == 0) {
        document.getElementById("noComplete").classList.remove("inactive");
        }
}
document.getElementById('trash').addEventListener('drop',dropInBin);
function determineClosestAfterElement(container, yMousePosition) {
    const allOtherDraggableElements = Array.from(container.querySelectorAll('.listItemWrapper:not(.isBeingDragged)'));
    return allOtherDraggableElements.reduce((closest, element)=> {
        const box = element.getBoundingClientRect();
        const distanceFromMiddle = yMousePosition - box.top - (box.height/2);
        //we consider only elements below the mouse position, hence why < 0
        if (distanceFromMiddle < 0 && distanceFromMiddle > closest.distanceFromMiddle) {
            return {distanceFromMiddle: distanceFromMiddle,
                element: element};
        } else {
            return closest;
        }
    }, {distanceFromMiddle: Number.NEGATIVE_INFINITY}).element;
    //for each listItem thats not being dragged,
    //use a reduce method, where the reduce method calculates the differential between the y mouse position
    //and the middle of each listItem
    //then, considering only the listItems that are below Y mouse position,
    //create an object that determines its differential, and also an element reference.
    //the reduce function ultimately returns only the element reference.
    //the default value is negative infinity
};