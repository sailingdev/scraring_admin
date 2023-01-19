/**
 * Created by narav on 6/8/2019.
 */

$('#btn_add_category').click(function () {
    $('#modal_create_category').modal();
});

function viewCategory(id) {

}

function editCategory(id) {
    $.ajax({
        url: '/ctgadmin/categories/edit/'+id,
        method: 'get',
        success: function (res) {
            $('#e_name').val(res['name']);
            $('#e_description').val(res['description']);
            $('#form_edit_category').attr('action', '/ctgadmin/categories/update/'+id);
            $('#modal_edit_category').modal()
        }
    })
}

function deleteCategory(id) {
    if (confirm("Are You Sure to Delete This Category?")) {
        $.ajax({
            url: '/ctgadmin/categories/delete/'+id,
            method: 'get',
            success: function (res) {
                if(res === "failed") {
                    alert("This Category contains Child category. Can't delete it.")
                }
                if (res === "success") {
                    window.location.reload();
                }
            }
        })
    }
}

$('#certification').change(function () {
    var certification = $(this).val();
    var category_list = $('#parent');
    category_list.html('');
    $.ajax({
        url: '/ctgadmin/categories/certification/'+certification,
        method: 'get',
        success: function (res) {
            category_list.append('<option value="0">--- Parent ---</option>');
            res.forEach(function (item) {
                var astree = displayAsTree(item.depth);
                var category = '<option value="' + item.id + '">' + astree + item.name + '</option>';
                category_list.append(category);
            })
        }
    });
});

$('#e_certification').change(function () {
    var certification = $(this).val();
    var category_list = $('#e_parent');
    category_list.html('');
    $.ajax({
        url: '/ctgadmin/categories/certification/'+certification,
        method: 'get',
        success: function (res) {
            category_list.append('<option value="0">--- Parent ---</option>');
            res.forEach(function (item) {
                var astree = displayAsTree(item.depth);
                var category = '<option value="' + item.id + '">' + astree + item.name + '</option>';
                category_list.append(category);
            })
        }
    });
});

function displayAsTree(depth) {
    var space = '';
    for (var i=0; i<depth; i++) {
        space += ' -';
    }
    return space;
}
