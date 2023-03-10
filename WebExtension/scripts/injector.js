if (typeof BrowserNameSpace === "undefined") {
    if (typeof browser !== 'undefined')
        BrowserNameSpace = browser;
    else if (typeof chrome !== 'undefined')
        BrowserNameSpace = chrome;
}

function injectMdmModal(){
    const html = `
<div id="mdm-modal-holder" class="mdm-modal-holder-hide">
    <div id="mdm-modal">
        <div class="mdm-header">
            <div class="mdm-logo"></div>
            <span> Mounzil</span>
        </div>

        <div id="mdm_filter_title" style="margin: 15px; font-size: 1.5em; color:#00897b">Filter group downloads</div>
        <div class="form">
            <div class="mdm-inputs">
                
                <select id="mdm_include_or_exclude" class="mdm-select" style="display: inline-block">
                    <option value="include"> Include</option>
                    <option value="exclude"> Exclude </option>
                </select>
                
                <input placeholder="in filename" type="text" id="mdm_text" class="mdm-input" style="display: inline-block">

               <select id="mdm_include_extension" class="mdm-select" style="display: inline-block">
                            
               </select>
            </div>
        </div> 
        <div class="mdm-actions">
            <mdminput id="mdm_captuare_links"> Capture <mdmlinkcount id="mdm-link-count"></mdmlinkcount> Links! </mdminput>
            <mdminput id="mdm_cancel_modal"> Cancel </mdminput>
        </div>
        <div id="mdm-preview-links">
        </div>
    </div>
</div>`;

    document.body.insertAdjacentHTML('beforeend', html);

}

function showMdmModal(extensions) {
    const modalHolder = document.getElementById('mdm-modal-holder');
    const modal = document.getElementById('mdm-modal');
    setTimeout( ()=> modal.classList.add("mdm-animate-down"),
        100);
    modalHolder.classList.remove('mdm-modal-holder-hide');
    const includeSelectOption = document.getElementById("mdm_include_extension");
    let options = `<option value="no_extension">Select Extension</option>`;
    for( let k of Object.keys(extensions)){
        options+=`<option value="${MdmSanitizeHTML(k)}">${MdmSanitizeHTML(k)}</option>`;
    }
    includeSelectOption.innerHTML = options;

    // document.body.classList.add('mdm-blurer');
}

function MdmSanitizeHTML(str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}
function removeMdmModal() {
    // const modalHolder = document.getElementById('mdm-modal-holder');
    // modalHolder.classList.add('mdm-modal-holder-hide');
    const holder = document.getElementById("mdm-modal-holder");
    holder.parentNode.removeChild(holder); // This syntax for delete dom is really dumb as fuck !
}
function getFileNameFromUrl(link) {
    let possibleFileName = link.split('/').pop().split('#')[0].split('?')[0].trim();
    try{
        return decodeURIComponent(possibleFileName);
    }catch (e) {
        return possibleFileName;
    }
}
function getExtensionOfUrl(link) {
    const tempFileName = getFileNameFromUrl(link);
    let filename = tempFileName === "" ? link : tempFileName ;
    const dotPos = filename.lastIndexOf(".");
    if(dotPos===-1)
        return "";
    filename = filename.substr(dotPos+1, 4);

    return !filename.match(/^([0-9a-z]+)$/i) || !isNaN(filename) ? "" : filename;
}

function sendToExtension(msg) {
    BrowserNameSpace.runtime.sendMessage({
        type:"getSelected",
        message: msg
    });
}
function dismissModal(links, success) {
    if(success)
        sendToExtension(links);
    removeMdmModal();

}
function shortcutHandler(event, onSucess, onFail){
    if (event.code === "Enter") {
        onSucess()
    } else if (event.code === "Escape") {
        onFail()
    }
}
injectMdmModal();
