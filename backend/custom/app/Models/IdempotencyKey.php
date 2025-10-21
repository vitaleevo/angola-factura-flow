<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IdempotencyKey extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'key',
        'scope',
        'resource_id',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];
}
