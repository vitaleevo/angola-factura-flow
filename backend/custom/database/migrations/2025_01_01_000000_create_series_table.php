<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('series', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id');
            $table->string('code', 20);
            $table->string('doc_type', 4);
            $table->unsignedBigInteger('next_number')->default(1);
            $table->boolean('active')->default(true);
            $table->timestamps();
            $table->unique(['company_id', 'code', 'doc_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('series');
    }
};
