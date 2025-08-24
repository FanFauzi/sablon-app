<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use League\CommonMark\Node\Query\OrExpr;

// Route::get('/homePage', function () {
//     return Inertia::render('HomePage');
// });

Route::redirect('/', '/home-page');
Route::get('/home-page', function() {
    return Inertia::render('HomePage');
});

Route::get('/custom-design', function () {
    return Inertia::render('CustomTshirtDesigner');
})->name('custom-design');

Route::get('/product', function () {
    return Inertia::render('Product/Index');
})->name('product.index');

Route::get('/product/{id}', function ($id) {
    return Inertia::render('Product/Detail', ['id' => $id]);
})->name('product.detail');


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
