//functions to be added on
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
function fromToDo(e) {
    if (!e.target.nextElementSibling.value) {
        e.target.checked = false;
        return;
    };
    e.target.removeEventListener('click', fromToDo);
    //e.target.removeEventListener('change', fromCompleted);
    let listItem = e.target.parentNode.parentNode;
    e.target.nextElementSibling.classList.add("strikethrough");
    e.target.nextElementSibling.setAttribute('disabled','true');
    //console.log(e.target.nextElementSibling.getAttribute('contenteditable'));
    setTimeout(()=>{
    draggableZoneCompleted.appendChild(listItem);
    if (draggableZoneCompleted.children.length >= 1) {
        document.getElementById("noComplete").classList.add("inactive");
    }
    e.target.checked = true;
    e.target.nextElementSibling.classList.remove("strikethrough");
    }, 1000);
    //e.target.removeEventListener('change', fromToDo);
    e.target.addEventListener('click', fromCompleted);
    console.log(draggableZoneToDo.children.length);
    if (draggableZoneToDo.children.length == 1) {
        draggableZoneToDo.appendChild(createListItem());
    }
    
    console.log("i'm in ToDoLoadScript");
}

function fromCompleted(e) {
    if (!e.target.nextElementSibling.value) {
        e.target.checked = false;
        return;
    };
    e.target.removeEventListener('click', fromCompleted);
    //e.target.removeEventListener('change', fromToDo);
    let listItem = e.target.parentNode.parentNode;
    listItem.classList.add("opacityOne");
    e.target.nextElementSibling.removeAttribute('disabled');
    setTimeout(()=> {
        //e.target.checked = false;
        draggableZoneToDo.appendChild(listItem);
        console.log("i'm in fromCompletedloadScript");
        //
        listItem.classList.remove("opacityOne");
    }, 500);
    e.target.addEventListener('click', fromToDo);
    e.target.removeEventListener('click', fromCompleted);
    setTimeout(()=> {
        if (draggableZoneCompleted.children.length == 0) {
        document.getElementById("noComplete").classList.remove("inactive");
        }
    }, 500);
}
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
function rotate(e) {
    e.target.classList.toggle('rotate');
    e.target.parentElement.parentElement.classList.toggle('reveal');
}
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
/**************Above is functions****************/
function loadBody() {
    var bodyHTML = localStorage.getItem('bodyHTML');
        if (bodyHTML) {
            document.body.innerHTML = bodyHTML;
        }
    const oldScript = document.getElementById('mainScript');
    console.log(oldScript);
    if (oldScript) {
        oldScript.remove();
    }
    var newScript = document.createElement('script');
    newScript.id = 'mainScript';
    newScript.src = 'toDoListScript.js';
    document.body.insertAdjacentElement('afterbegin',newScript);
    var inputs = document.querySelectorAll('input');
    inputs.forEach(function(i,index) {
        let value = localStorage.getItem(`input${index}`);
        i.value = value;
    });
    let listItemWrappers = document.querySelectorAll('#draggableZoneToDo .listItemWrapper');
    listItemWrappers.forEach(function(l) {
        l.addEventListener('dragstart',dragStart);
        l.querySelector('[type=checkbox]').addEventListener('click', fromToDo);
        l.querySelector('[type=checkbox]').addEventListener('input', createModifyLastUpdate);
        l.querySelector('.carat').addEventListener('click',rotate);
        l.querySelector('.categoryBox div').addEventListener('click', revealCategories);
        l.querySelector('.divBox').addEventListener('blur',createModifyLastUpdate);
        l.querySelector('.divBox').addEventListener('click', function recordText(e) {
            let storage = e.target.textContent;
            e.target.setAttribute('data-text', storage);
        });
    });
    let listItemWrappersCompleted = document.querySelectorAll('#draggableZoneCompleted .listItemWrapper');
    listItemWrappersCompleted.forEach(function(l) {
        l.addEventListener('dragstart',dragStart);
        l.querySelector('[type=checkbox]').addEventListener('click', fromCompleted);
        l.querySelector('[type=checkbox]').addEventListener('click',function(e) {
            if (!e.target.nextElementSibling.value) {
                return
            } else {
                createModifyLastUpdate(e);
            }
        });
        l.querySelector('[type=checkbox]').addEventListener('input', createModifyLastUpdate);
        l.querySelector('[type=checkbox]').checked = true;
        l.querySelector('.carat').addEventListener('click',rotate);
        l.querySelector('.categoryBox div').addEventListener('click', revealCategories);
        l.querySelector('.divBox').addEventListener('blur',createModifyLastUpdate);
        l.querySelector('.divBox').addEventListener('click', function recordText(e) {
            let storage = e.target.textContent;
            e.target.setAttribute('data-text', storage);
        });
    });
    
    
}
window.onload = loadBody;

function saveBody() {
    var bodyContent = document.body.innerHTML;
    localStorage.setItem('bodyHTML', bodyContent);
    console.log('save done')
    var inputs = document.body.querySelectorAll('input');
    inputs.forEach(function(i,index) {
        localStorage.setItem(`input${index}`, i.value);
    });
}

setInterval(saveBody, 2000);